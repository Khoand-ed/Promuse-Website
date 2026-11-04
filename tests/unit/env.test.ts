import { describe, expect, it } from 'vitest';
import { parseEnv } from '@/lib/env';

const mock = {
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_BACKEND_MODE: 'mock',
};

const supabase = {
  NEXT_PUBLIC_SITE_URL: 'https://promuse.example',
  NEXT_PUBLIC_BACKEND_MODE: 'supabase',
  NEXT_PUBLIC_SUPABASE_URL: 'https://project-ref.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
};

describe('parseEnv', () => {
  it('accepts mock mode without Supabase variables', () => {
    expect(parseEnv(mock).NEXT_PUBLIC_BACKEND_MODE).toBe('mock');
  });

  it('accepts off mode without Supabase variables', () => {
    expect(parseEnv({ ...mock, NEXT_PUBLIC_BACKEND_MODE: 'off' }).NEXT_PUBLIC_BACKEND_MODE).toBe(
      'off',
    );
  });

  it('treats empty strings as missing', () => {
    const env = parseEnv({ ...mock, NEXT_PUBLIC_SUPABASE_URL: '' });
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeUndefined();
  });

  it('accepts supabase mode with both Supabase variables', () => {
    expect(parseEnv(supabase).NEXT_PUBLIC_SUPABASE_URL).toBe('https://project-ref.supabase.co');
  });

  it('names each Supabase variable missing in supabase mode', () => {
    const missing = {
      ...supabase,
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
    };
    expect(() => parseEnv(missing)).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL[\s\S]*NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/,
    );
  });

  it('rejects an unknown backend mode', () => {
    expect(() => parseEnv({ ...mock, NEXT_PUBLIC_BACKEND_MODE: 'firebase' })).toThrow(
      /NEXT_PUBLIC_BACKEND_MODE/,
    );
  });

  it('rejects a site URL that is not a URL', () => {
    expect(() => parseEnv({ ...mock, NEXT_PUBLIC_SITE_URL: 'promuse' })).toThrow(
      /NEXT_PUBLIC_SITE_URL/,
    );
  });
});
