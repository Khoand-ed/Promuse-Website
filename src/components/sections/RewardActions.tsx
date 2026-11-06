'use client';

import { useLocale, useTranslations } from 'next-intl';
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { ArrowRight, GoogleG } from '@/components/ui/icons';
import { Modal } from '@/components/ui/Modal';
import { afterOpening } from '@/lib/motion/opening';
import { createRewardGateway, type BackendMode, type RewardGateway } from '@/lib/reward';
import { isSignedIn, popupAllowed, reduce, type RewardState } from '@/lib/reward/machine';
import {
  AUTH_CANCELLED,
  AUTH_ERROR,
  AUTH_PARAM,
  INTENT_PARAM,
  INTENT_PREREG,
  PROVIDER_ERROR_PARAMS,
} from '@/lib/reward/types';

/** localStorage: set once the first-visit popup has been closed or used (doc/SPEC.md, section 5). */
export const POPUP_KEY = 'promuse:reward-popup-dismissed';
const POPUP_DELAY_MS = 1500;

function popupDismissed(): boolean {
  try {
    return localStorage.getItem(POPUP_KEY) !== null;
  } catch {
    return false;
  }
}

function dismissPopup() {
  try {
    localStorage.setItem(POPUP_KEY, '1');
  } catch {
    // Without storage the popup may come back on the next visit.
  }
}

/**
 * sessionStorage: set while the visitor is away at Google. Coming back without an answer from it
 * (Back, or Google's own Cancel, which can lead to its sign-in page instead of back here) is a
 * cancelled sign-in.
 */
const SIGN_IN_PENDING_KEY = 'promuse:sign-in-pending';

function setSignInPending(pending: boolean) {
  try {
    if (pending) sessionStorage.setItem(SIGN_IN_PENDING_KEY, '1');
    else sessionStorage.removeItem(SIGN_IN_PENDING_KEY);
  } catch {
    // Without storage, coming back simply shows the sign-in button again.
  }
}

function signInPending(): boolean {
  try {
    return sessionStorage.getItem(SIGN_IN_PENDING_KEY) !== null;
  } catch {
    return false;
  }
}

/** What the URL, or the visitor's way back, says about a trip to Google that just ended. */
function readReturn() {
  if (typeof window === 'undefined') return { intent: false, cancelled: false, failed: false };
  const params = new URLSearchParams(window.location.search);
  const fromSupabase = params.has('error_code') || params.has('error_description');
  const providerError = fromSupabase ? (params.get('error') ?? 'unknown') : null;
  const intent = params.get(INTENT_PARAM) === INTENT_PREREG;
  const cancelled = params.get(AUTH_PARAM) === AUTH_CANCELLED || providerError === 'access_denied';
  const failed =
    params.get(AUTH_PARAM) === AUTH_ERROR ||
    (providerError !== null && providerError !== 'access_denied');
  const abandoned = !intent && !cancelled && !failed && signInPending();
  return { intent, cancelled: cancelled || abandoned, failed };
}

interface Handlers {
  signIn(): void;
  register(): void;
  retry(): void;
}

/** The pill for a state, or the confirmation once registered (doc/SPEC.md, section 7). */
function RewardControl({
  state,
  handlers,
  compact = false,
}: {
  state: RewardState;
  handlers: Handlers;
  /** The popup's narrower column takes a regular pill instead of the large one. */
  compact?: boolean;
}) {
  const t = useTranslations('reward.states');
  const locale = useLocale();

  if (state.kind === 'registered' || state.kind === 'alreadyRegistered') {
    const text =
      state.kind === 'registered'
        ? t('registered', { email: state.email })
        : t('alreadyRegistered', {
            date: new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
              new Date(state.registeredAt),
            ),
          });
    return (
      <p
        data-reward-result
        className="bg-mist max-w-[36rem] rounded-[2rem] px-8 py-5 text-[16px] font-semibold"
      >
        {text}
      </p>
    );
  }

  const view: { label: string; action?: () => void; google?: boolean; busy?: boolean } = (() => {
    switch (state.kind) {
      case 'loading':
        return { label: t('signedOut'), google: true, busy: true };
      case 'notOpen':
        return { label: t('notOpen') };
      case 'signedOut':
        return { label: t('signedOut'), google: true, action: handlers.signIn };
      case 'redirecting':
        return { label: t('redirecting'), google: true, busy: true };
      case 'signedInNotRegistered':
        return { label: t('signedInNotRegistered'), action: handlers.register };
      case 'registering':
        return { label: t('registering'), busy: true };
      case 'closed':
        return { label: t('closed') };
      case 'error':
        return { label: t('error'), action: handlers.retry };
    }
  })();

  return (
    <button
      type="button"
      disabled={!view.action}
      aria-busy={view.busy || undefined}
      data-beat={view.action ? true : undefined}
      onClick={view.action}
      className={compact ? 'pill min-h-14 px-7 text-[15px]' : 'pill pill-xl'}
    >
      {view.google ? (
        <span className="google-mark">
          <GoogleG />
        </span>
      ) : null}
      {view.label}
      {view.action ? <ArrowRight className="shrink-0" /> : null}
    </button>
  );
}

interface RewardActionsProps {
  mode: BackendMode;
  /** The reward art, rendered on the server, for the popup. */
  popupArt: ReactNode;
}

/**
 * The reward widget (doc/SPEC.md, sections 5 and 7): a state machine over the reward gateway, the
 * banner's button and messages, "Not you? Sign out", the return from Google, and the first-visit
 * popup. It holds no backend code; `off` mode has no gateway and shows `notOpen`.
 */
export function RewardActions({ mode, popupArt }: RewardActionsProps) {
  const t = useTranslations('reward');
  const locale = useLocale();
  const [state, dispatch] = useReducer(
    reduce,
    mode === 'off' ? { kind: 'notOpen' } : { kind: 'loading' },
  );
  const [returned] = useState(readReturn);
  const [popup, setPopup] = useState(false);
  const gateway = useRef<RewardGateway | null>(null);
  const current = useRef(state);

  useEffect(() => {
    current.current = state;
  }, [state]);

  const register = useCallback(async () => {
    const backend = gateway.current;
    if (!backend) return;
    dispatch({ type: 'register' });
    try {
      dispatch({ type: 'registered', result: await backend.register(locale) });
    } catch {
      dispatch({ type: 'registerFailed' });
    }
  }, [locale]);

  const readStatus = useCallback(async (cancelled: boolean) => {
    const backend = gateway.current;
    if (!backend) return;
    dispatch({ type: 'reload' });
    try {
      dispatch({ type: 'status', status: await backend.getStatus(), cancelled });
    } catch {
      dispatch({ type: 'statusFailed' });
    }
  }, []);
  const loadStatus = useCallback(() => readStatus(false), [readStatus]);

  // Read the status once, then finish a trip to Google: register once, or report the cancellation.
  useEffect(() => {
    if (mode === 'off') return;
    setSignInPending(false);
    const back = returned.intent || returned.cancelled || returned.failed;
    if (back) {
      const url = new URL(window.location.href);
      for (const name of [INTENT_PARAM, AUTH_PARAM, ...PROVIDER_ERROR_PARAMS]) {
        url.searchParams.delete(name);
      }
      // Next.js adopts a URL changed with `replaceState(null, …)`, but only once its router has
      // mounted and wrapped the History API, which happens after this effect. A router it never told
      // would put the parameters back on its next refresh, so wait a tick.
      window.setTimeout(() =>
        window.history.replaceState(null, '', url.pathname + url.search + url.hash),
      );
    }
    let live = true;
    createRewardGateway(mode)
      .then(async (backend) => {
        if (!live || !backend) return;
        gateway.current = backend;
        const status = await backend.getStatus();
        if (!live) return;
        dispatch({ type: 'status', status, cancelled: returned.cancelled });
        // The sign-in itself failed on the way back: offer a retry that reads the status again.
        if (returned.failed) dispatch({ type: 'statusFailed' });
        if (back) document.getElementById('reward')?.scrollIntoView({ block: 'center' });
        if (returned.intent && status.kind === 'signedIn' && !status.registered) await register();
      })
      .catch(() => {
        if (live) dispatch({ type: 'statusFailed' });
      });
    return () => {
      live = false;
    };
  }, [mode, returned, register]);

  // Back from Google without signing in, to a page the browser kept in its back/forward cache: it
  // would still say "Redirecting to Google…", so read the status again and report the cancellation.
  useEffect(() => {
    const onShow = (event: PageTransitionEvent) => {
      if (!event.persisted || current.current.kind !== 'redirecting') return;
      setSignInPending(false);
      void readStatus(true);
    };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, [readStatus]);

  // The first-visit popup: 1.5 s after the opening (or the load), once, and only while it can help.
  const statusKnown = state.kind !== 'loading';
  useEffect(() => {
    if (!statusKnown || !popupAllowed(current.current, popupDismissed())) return;
    let timer: number | undefined;
    const stop = afterOpening(() => {
      timer = window.setTimeout(() => {
        if (popupAllowed(current.current, popupDismissed())) setPopup(true);
      }, POPUP_DELAY_MS);
    });
    return () => {
      stop();
      window.clearTimeout(timer);
    };
  }, [statusKnown]);

  const signIn = useCallback(async () => {
    const backend = gateway.current;
    if (!backend) return;
    dispatch({ type: 'signIn' });
    // Google brings the visitor back here with ?intent=prereg, which runs the registration once.
    const url = new URL(window.location.href);
    url.searchParams.set(INTENT_PARAM, INTENT_PREREG);
    url.hash = 'reward';
    try {
      setSignInPending(true);
      await backend.signIn(url.pathname + url.search + url.hash);
    } catch {
      setSignInPending(false);
      dispatch({ type: 'statusFailed' });
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await gateway.current?.signOut();
      dispatch({ type: 'signedOut' });
    } catch {
      // The retry reads the status again.
      dispatch({ type: 'statusFailed' });
    }
  }, []);

  const retry = state.kind === 'error' && state.email ? register : loadStatus;
  // Using the button, in the banner or the popup, settles the popup: it never comes back to invite
  // someone who already started, for example after cancelling at Google.
  const handlers: Handlers = {
    signIn: () => {
      dismissPopup();
      void signIn();
    },
    register: () => {
      dismissPopup();
      void register();
    },
    retry,
  };
  const rise = (n: number) => ({ '--rise': n }) as CSSProperties;

  return (
    <>
      <div aria-live="polite" className="grid justify-items-center gap-4">
        <RewardControl state={state} handlers={handlers} />
        {state.kind === 'signedOut' && state.cancelled ? (
          <p className="text-[14px]">{t('states.cancelled')}</p>
        ) : null}
        {isSignedIn(state) && 'email' in state ? (
          <p className="flex flex-wrap items-center justify-center gap-x-2 text-[14px]">
            <span>{state.email}</span>
            <span aria-hidden="true">·</span>
            <span>{t('notYou')}</span>
            <button
              type="button"
              onClick={() => void signOut()}
              className="min-h-11 underline underline-offset-4 hover:no-underline"
            >
              {t('signOut')}
            </button>
          </p>
        ) : null}
      </div>

      <Modal
        open={popup}
        onClose={() => {
          setPopup(false);
          dismissPopup();
        }}
        labelledBy="reward-popup-title"
        variant="card"
      >
        <div className="reward-card">
          <div className="bg-mist">{popupArt}</div>
          <div className="grid justify-items-center gap-6 px-6 py-10 text-center md:px-12 md:py-14">
            <h2
              id="reward-popup-title"
              data-rise
              style={rise(0)}
              className="type-display text-[2.4rem] leading-[1.05] md:text-[3.2rem]"
            >
              {t('title')}
            </h2>
            <p data-rise style={rise(1)} className="text-[15px] leading-[1.9] tracking-[0.04em]">
              {t('desc')}
            </p>
            <div data-rise style={rise(2)}>
              <RewardControl state={state} handlers={handlers} compact />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
