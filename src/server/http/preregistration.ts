import 'server-only';
import type { z } from 'zod';
import { registerBody } from '@/server/schemas/preregistration';
import type { Services, UserContext } from '@/server/services/types';
import { apiRoute } from './handler';
import { errorResponse, json } from './responses';

export type Authenticate = (
  request: Request,
) => Promise<{ user: UserContext; services: Services } | null>;

const issuesOf = (error: z.ZodError) =>
  error.issues.map(({ path, message }) => ({ path: path.join('.'), message }));

/**
 * `GET` and `POST /api/v1/preregistration` (doc/API.md). Each one authenticates, parses its input,
 * calls one service method and maps the result to HTTP; the rules live in the service.
 */
export function preregistrationRoutes(authenticate: Authenticate) {
  return {
    GET: apiRoute('GET /api/v1/preregistration', async (request) => {
      const caller = await authenticate(request);
      if (!caller) return errorResponse('unauthorized');
      return json(await caller.services.preregistration.getStatus(caller.user));
    }),

    POST: apiRoute('POST /api/v1/preregistration', async (request) => {
      const caller = await authenticate(request);
      if (!caller) return errorResponse('unauthorized');
      const body = registerBody.safeParse(await request.json().catch(() => undefined));
      if (!body.success) return errorResponse('validation_failed', { issues: issuesOf(body.error) });
      const result = await caller.services.preregistration.register(caller.user, body.data.locale);
      if (result.status === 'campaign_closed') return errorResponse('campaign_closed');
      return json(result, result.status === 'created' ? 201 : 200);
    }),
  };
}
