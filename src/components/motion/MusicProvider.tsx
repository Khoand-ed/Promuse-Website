'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { gsap } from '@/lib/motion/gsap';

interface MusicState {
  /** Whether there is anything to play (a file, or the development click track). */
  available: boolean;
  playing: boolean;
  toggle(): void;
  /** Playback position in seconds while playing, otherwise null. BeatClock reads it. */
  time(): number | null;
  bpm: number;
  firstBeat: number;
}

const MusicContext = createContext<MusicState>({
  available: false,
  playing: false,
  toggle: () => {},
  time: () => null,
  bpm: 120,
  firstBeat: 0,
});

export function useMusic(): MusicState {
  return useContext(MusicContext);
}

interface Source {
  play(volume: number): Promise<void>;
  /** Fades out first unless `now`; a hidden tab gets no animation frames, so it stops at once. */
  pause(now?: boolean): void;
  time(): number;
}

function fileSource(src: string): Source {
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = 'auto';
  return {
    async play(volume) {
      audio.volume = 0;
      await audio.play();
      gsap.to(audio, { volume, duration: 0.5, overwrite: true });
    },
    pause(now) {
      if (now) {
        gsap.killTweensOf(audio);
        audio.pause();
        return;
      }
      gsap.to(audio, {
        volume: 0,
        duration: 0.4,
        overwrite: true,
        onComplete: () => audio.pause(),
      });
    },
    time: () => audio.currentTime,
  };
}

/** Development only: a looping click on every beat, rendered once into a buffer (no timers). */
function clickTrack(bpm: number): Source {
  const context = new AudioContext();
  const beat = 60 / bpm;
  const beats = 8;
  const buffer = context.createBuffer(
    1,
    Math.round(context.sampleRate * beat * beats),
    context.sampleRate,
  );
  const samples = buffer.getChannelData(0);
  for (let n = 0; n < beats; n++) {
    const start = Math.round(n * beat * context.sampleRate);
    const pitch = n % 4 === 0 ? 1320 : 880;
    for (let i = 0; i < context.sampleRate * 0.03; i++) {
      samples[start + i] =
        Math.sin((2 * Math.PI * pitch * i) / context.sampleRate) *
        (1 - i / (context.sampleRate * 0.03));
    }
  }
  const gain = context.createGain();
  gain.connect(context.destination);
  let node: AudioBufferSourceNode | null = null;
  let startedAt = 0;
  return {
    async play(volume) {
      await context.resume();
      node = context.createBufferSource();
      node.buffer = buffer;
      node.loop = true;
      node.connect(gain);
      gain.gain.value = volume;
      startedAt = context.currentTime;
      node.start();
    },
    pause() {
      node?.stop();
      node = null;
    },
    time: () => (context.currentTime - startedAt) % (beat * beats),
  };
}

interface MusicProviderProps {
  /** The music file, or null when the owner has not added it (the button then stays hidden). */
  src: string | null;
  bpm: number;
  firstBeat: number;
  volume: number;
  /** Development pages: play a click track when there is no file. */
  clickTrackFallback?: boolean;
  children: ReactNode;
}

/**
 * Background music (doc/SPEC.md, section 3). Off on every visit: browsers only allow sound after a
 * click. It loops, fades in and out, and pauses while the tab is hidden.
 */
export function MusicProvider({
  src,
  bpm,
  firstBeat,
  volume,
  clickTrackFallback,
  children,
}: MusicProviderProps) {
  const [playing, setPlaying] = useState(false);
  const source = useRef<Source | null>(null);
  const available = src !== null || Boolean(clickTrackFallback);

  const toggle = useCallback(() => {
    if (!available) return;
    source.current ??= src ? fileSource(src) : clickTrack(bpm);
    if (playing) {
      source.current.pause();
      setPlaying(false);
    } else {
      source.current.play(volume).then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    }
  }, [available, src, bpm, playing, volume]);

  useEffect(() => {
    if (!playing) return;
    const onVisibility = () => {
      if (document.hidden) source.current?.pause(true);
      else void source.current?.play(volume);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [playing, volume]);

  const time = useCallback(
    () => (playing && source.current ? source.current.time() : null),
    [playing],
  );

  return (
    <MusicContext value={{ available, playing, toggle, time, bpm, firstBeat }}>
      {children}
    </MusicContext>
  );
}
