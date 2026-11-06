/** `GET /api/v1/health` (doc/API.md): no authentication, no database. */
export function GET() {
  return Response.json({ ok: true, version: '1' });
}
