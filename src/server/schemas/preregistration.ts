import 'server-only';
import { z } from 'zod';

/** Body of `POST /api/v1/preregistration` (doc/API.md). */
export const registerBody = z.object({ locale: z.enum(['vi', 'en']) });
