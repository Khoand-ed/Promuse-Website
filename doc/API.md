# Promuse API v1

The HTTP contract of the Promuse website's backend. Its only client today is the landing page. The game does not call it; the planned server-to-server link is in `ARCHITECTURE.md`, section 17. Changes are additive only; anything breaking goes to `/api/v2`.

## Basics

- Base URL: `https://<project>.vercel.app/api/v1` (locally `http://localhost:3000/api/v1`).
- JSON in and out, UTF-8. Timestamps are ISO 8601 in UTC.
- Endpoints that need a user send `Cache-Control: no-store`.
- Authentication:
  - Web: the Supabase session cookie, same origin.
  - Tests and other first-party clients: `Authorization: Bearer <access token>` from the same Supabase project.

### Errors

```json
{ "error": { "code": "campaign_closed", "message": "Pre-registration has ended.", "details": {} } }
```

| HTTP | `code` | Meaning |
|---|---|---|
| 400 | `validation_failed` | Body, query or path parameter is invalid |
| 401 | `unauthorized` | Missing, invalid or expired token |
| 410 | `campaign_closed` | Pre-registration is over |
| 500 | `internal` | Unexpected server error |

### Types

```ts
type Locale = 'vi' | 'en';
```

## Endpoints

### `GET /health`

No authentication.

`200` → `{ "ok": true, "version": "1" }`

### `GET /preregistration`

Authentication required.

`200` → `{ "registered": false }`

`200` → `{ "registered": true, "registeredAt": "2026-11-04T08:00:00Z", "campaignKey": "prereg-launch" }`

### `POST /preregistration`

Authentication required. Body: `{ "locale": "vi" }`. Idempotent: calling it again never creates a second registration.

- `201` → `{ "status": "created", "registeredAt": "2026-11-04T08:00:00Z", "campaignKey": "prereg-launch" }`
- `200` → `{ "status": "existing", "registeredAt": "2026-11-04T08:00:00Z", "campaignKey": "prereg-launch" }`
- `410` → `campaign_closed`

## Not in v1

- No mail endpoints. The game's own Mailbox delivers rewards (`ARCHITECTURE.md`, section 17).
- The server-to-server integration endpoint is designed in `ARCHITECTURE.md`, section 17, and is added only when the game is ready for it.

## Trying it with curl

During development, `/dev/token` (404 in production) shows the access token of the signed-in browser session.

```bash
TOKEN="<access token>"
BASE="http://localhost:3000/api/v1"

curl -s "$BASE/preregistration" -H "Authorization: Bearer $TOKEN"
curl -s -X POST "$BASE/preregistration" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"locale":"vi"}'
```
