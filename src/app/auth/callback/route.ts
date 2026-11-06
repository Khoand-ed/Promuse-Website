import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { returnUrl, type SignInOutcome } from '@/server/http/callback';

/** Exchanges the code for a session cookie, or says why the sign-in did not complete. */
async function finishSignIn(params: URLSearchParams): Promise<{ outcome: SignInOutcome; cause?: string }> {
  const providerError = params.get('error');
  if (providerError === 'access_denied') return { outcome: 'cancelled' };
  if (providerError) return { outcome: 'failed', cause: providerError };
  const code = params.get('code');
  if (!code) return { outcome: 'failed', cause: 'missing_code' };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return error ? { outcome: 'failed', cause: error.code ?? error.name } : { outcome: 'signedIn' };
}

/**
 * The end of the Google sign-in (PKCE, doc/ARCHITECTURE.md, section 7): Supabase brings the visitor
 * here with a code, or with `error=access_denied` when they backed out at Google. Either way they go
 * back to the page they came from.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const { outcome, cause } = await finishSignIn(searchParams);
  if (cause) {
    // Error keys only: never tokens, codes or email addresses.
    console.warn(JSON.stringify({ route: 'GET /auth/callback', code: 'sign_in_failed', cause }));
  }
  const response = NextResponse.redirect(returnUrl(searchParams.get('next'), outcome, origin));
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
