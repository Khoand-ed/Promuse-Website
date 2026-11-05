import 'server-only';

/** The error codes of doc/API.md. Add codes; never rename or remove one. */
export type ErrorCode = 'validation_failed' | 'unauthorized' | 'campaign_closed' | 'internal';

const ERRORS: Record<ErrorCode, { status: number; message: string }> = {
  validation_failed: { status: 400, message: 'The request is invalid.' },
  unauthorized: { status: 401, message: 'Sign in to continue.' },
  campaign_closed: { status: 410, message: 'Pre-registration has ended.' },
  internal: { status: 500, message: 'Something went wrong. Try again later.' },
};

/** Answers about a visitor must never be stored by a browser or a CDN. */
const NO_STORE = { 'Cache-Control': 'no-store' };

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: NO_STORE });
}

/** The error envelope: `{ "error": { "code", "message", "details" } }`. */
export function errorResponse(code: ErrorCode, details: Record<string, unknown> = {}): Response {
  const { status, message } = ERRORS[code];
  return Response.json({ error: { code, message, details } }, { status, headers: NO_STORE });
}
