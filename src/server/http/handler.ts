import 'server-only';
import { errorResponse } from './responses';

type Handler = (request: Request) => Promise<Response>;

/**
 * Wraps a route handler: every response carries an `X-Request-Id`, and an unexpected failure becomes
 * `internal` with one log line holding the route, the code and the request id. Logs never hold
 * tokens, cookies or email addresses (doc/ARCHITECTURE.md, section 11).
 */
export function apiRoute(route: string, handle: Handler): Handler {
  return async (request) => {
    const requestId = crypto.randomUUID();
    let response: Response;
    try {
      response = await handle(request);
    } catch (error) {
      console.error(JSON.stringify({ route, code: 'internal', requestId, cause: causeOf(error) }));
      response = errorResponse('internal');
    }
    response.headers.set('X-Request-Id', requestId);
    return response;
  };
}

/** A safe label for a failure: a database error code or the error's name, never its message. */
function causeOf(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }
  return error instanceof Error ? error.name : typeof error;
}
