import { authenticate } from '@/server/http/auth';
import { preregistrationRoutes } from '@/server/http/preregistration';

const routes = preregistrationRoutes(authenticate);

export const GET = routes.GET;
export const POST = routes.POST;
