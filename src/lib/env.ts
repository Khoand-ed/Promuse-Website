import { z } from 'zod';

const SUPABASE_KEYS = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'] as const;

const envSchema = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.url(),
    NEXT_PUBLIC_BACKEND_MODE: z.enum(['mock', 'supabase']),
    NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.NEXT_PUBLIC_BACKEND_MODE !== 'supabase') return;
    for (const key of SUPABASE_KEYS) {
      if (!value[key]) {
        ctx.addIssue({
          code: 'custom',
          path: [key],
          message: `${key} is required when NEXT_PUBLIC_BACKEND_MODE is "supabase".`,
        });
      }
    }
  });

export type Env = z.infer<typeof envSchema>;

/** Validates raw variables. Empty strings count as missing, as in a copied `.env.example`. */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const cleaned = Object.fromEntries(
    Object.entries(source).map(([key, value]) => [key, value === '' ? undefined : value]),
  );
  const result = envSchema.safeParse(cleaned);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

// Next.js inlines NEXT_PUBLIC_* values only where each variable is named in full.
export const env = parseEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_BACKEND_MODE: process.env.NEXT_PUBLIC_BACKEND_MODE,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});
