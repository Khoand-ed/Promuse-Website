'use client';

import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

// A development page, so its labels are plain Vietnamese.

/** No real user has this id, so a write that slipped through would still change nothing. */
const NOBODY = '00000000-0000-0000-0000-000000000000';
/** Postgres "insufficient privilege": what a blocked read or write answers. */
const BLOCKED = '42501';

interface Check {
  name: string;
  result: string;
  ok: boolean;
}

type Attempt = PromiseLike<{ error: { code?: string; message: string } | null }>;

async function blocked(name: string, attempt: Attempt): Promise<Check> {
  const { error } = await attempt;
  if (!error) return { name, result: 'KHÔNG bị chặn', ok: false };
  if (error.code === BLOCKED) return { name, result: `bị chặn (${BLOCKED})`, ok: true };
  return { name, result: `lỗi khác: ${error.code ?? '?'} ${error.message}`, ok: false };
}

/** Every direct write from the browser client must fail; reads return the visitor's own rows only. */
async function checkRls(supabase: SupabaseClient, userId: string): Promise<Check[]> {
  const registration = {
    user_id: NOBODY,
    campaign_key: 'prereg-launch',
    email: 'rls-check@example.com',
    google_sub: 'rls-check',
    locale: 'vi',
  };
  const checks = [
    await blocked(
      'Thêm một dòng vào preregistrations',
      supabase.from('preregistrations').insert(registration),
    ),
    await blocked(
      'Sửa preregistrations',
      supabase.from('preregistrations').update({ locale: 'en' }).eq('user_id', NOBODY),
    ),
    await blocked(
      'Xoá khỏi preregistrations',
      supabase.from('preregistrations').delete().eq('user_id', NOBODY),
    ),
    await blocked('Đọc campaigns', supabase.from('campaigns').select('key')),
    await blocked(
      'Thêm một chiến dịch vào campaigns',
      supabase
        .from('campaigns')
        .insert({ key: 'rls-check', kind: 'preregistration', title: {}, rewards: [] }),
    ),
  ];
  const { data, error } = await supabase.from('preregistrations').select('user_id');
  const rows = data ?? [];
  const own = rows.every((row) => row.user_id === userId);
  checks.push({
    name: 'Đọc preregistrations',
    result: error
      ? `lỗi: ${error.code ?? '?'} ${error.message}`
      : `${rows.length} dòng, ${own ? 'đều là của bạn' : 'CÓ dòng của người khác'}`,
    ok: !error && own,
  });
  return checks;
}

export function TokenTool({ enabled }: { enabled: boolean }) {
  const [supabase] = useState(() => (enabled ? createSupabaseBrowserClient() : null));
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    // The browser's own session, shown to its owner: getSession() is fine here, unlike on a server.
    void supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const signIn = () =>
    void supabase?.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/dev/token')}`,
        queryParams: { prompt: 'select_account' },
      },
    });

  const copy = async () => {
    if (!session) return;
    await navigator.clipboard.writeText(session.access_token);
    setCopied(true);
  };

  const runChecks = async () => {
    if (!supabase || !session) return;
    setChecks(null);
    setChecks(await checkRls(supabase, session.user.id));
  };

  return (
    <main className="bg-mist min-h-svh px-[6.7%] pt-28 pb-20">
      <div className="mx-auto grid max-w-[48rem] gap-8">
        <h1 className="type-display text-[3rem]">/dev/token</h1>

        {!supabase ? (
          <p className="type-body">
            Trang này cần <code>NEXT_PUBLIC_BACKEND_MODE=supabase</code> trong{' '}
            <code>.env.local</code>, rồi khởi động lại <code>npm run dev</code>.
          </p>
        ) : session === undefined ? (
          <p className="type-body">Đang đọc phiên đăng nhập…</p>
        ) : session === null ? (
          <div className="grid justify-items-start gap-4">
            <p className="type-body">Chưa đăng nhập.</p>
            <button type="button" onClick={signIn} className="pill min-h-11 px-6 text-[14px]">
              Đăng nhập bằng Google
            </button>
          </div>
        ) : (
          <>
            <section className="grid gap-3">
              <p className="type-body">
                {session.user.email} · id <code>{session.user.id}</code>
                <br />
                Hết hạn lúc{' '}
                {new Date((session.expires_at ?? 0) * 1000).toLocaleTimeString('vi-VN')}; tải lại
                trang để lấy token mới.
              </p>
              <textarea
                readOnly
                aria-label="Access token"
                value={session.access_token}
                rows={5}
                className="w-full rounded-lg bg-white p-3 font-mono text-[12px] break-all"
              />
              <div className="flex flex-wrap gap-4">
                <button type="button" onClick={copy} className="pill min-h-11 px-6 text-[14px]">
                  {copied ? 'Đã copy' : 'Copy token'}
                </button>
                <button
                  type="button"
                  onClick={() => void supabase.auth.signOut({ scope: 'local' })}
                  className="min-h-11 underline underline-offset-4"
                >
                  Đăng xuất
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-white p-3 text-[12px]">
                {[
                  'TOKEN="<dán token vào đây>"',
                  `BASE="${window.location.origin}/api/v1"`,
                  'curl -s "$BASE/preregistration" -H "Authorization: Bearer $TOKEN"',
                  'curl -s -X POST "$BASE/preregistration" -H "Authorization: Bearer $TOKEN" \\',
                  `  -H "Content-Type: application/json" -d '{"locale":"vi"}'`,
                ].join('\n')}
              </pre>
            </section>

            <section className="grid gap-3">
              <h2 className="type-display text-[2rem]">Kiểm tra RLS</h2>
              <p className="type-body">
                Thử đọc và ghi thẳng vào bảng bằng client của trình duyệt, với phiên ở trên. Mọi lần
                ghi phải bị chặn; lần đọc chỉ được thấy dòng của chính bạn.
              </p>
              <button
                type="button"
                onClick={() => void runChecks()}
                className="pill min-h-11 justify-self-start px-6 text-[14px]"
              >
                Chạy kiểm tra
              </button>
              {checks ? (
                <ul className="type-body grid gap-1" aria-live="polite">
                  {checks.map((check) => (
                    <li key={check.name} data-ok={check.ok}>
                      {check.ok ? '✓' : '✗'} {check.name}: {check.result}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
