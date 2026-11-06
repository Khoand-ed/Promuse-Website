import { notFound } from 'next/navigation';
import { env } from '@/lib/env';
import { TokenTool } from './TokenTool';

/**
 * The signed-in session's access token, for curl tests against /api/v1 (doc/API.md), and a check
 * that the browser client cannot write to the tables directly (doc/PHASES.md, P3). 404 in production.
 */
export default function TokenPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <TokenTool enabled={env.NEXT_PUBLIC_BACKEND_MODE === 'supabase'} />;
}
