# Promuse API v1

The contract between the Promuse backend and its clients: the landing page now, the Unity game later. Changes are additive only; anything breaking goes to `/api/v2`.

## Basics

- Base URL: `https://<project>.vercel.app/api/v1` (locally `http://localhost:3000/api/v1`).
- JSON in and out, UTF-8. Timestamps are ISO 8601 in UTC.
- Endpoints that need a user send `Cache-Control: no-store`.
- Authentication:
  - Web: the Supabase session cookie, same origin.
  - Game: `Authorization: Bearer <access token>` from the same Supabase project.

### Errors

```json
{ "error": { "code": "already_claimed", "message": "This mail was already claimed.", "details": {} } }
```

| HTTP | `code` | Meaning |
|---|---|---|
| 400 | `validation_failed` | Body, query or path parameter is invalid |
| 401 | `unauthorized` | Missing, invalid or expired token |
| 404 | `not_found` | No such mail for this user |
| 409 | `already_claimed` | The mail was claimed before; `details` holds `claimedAt` and `rewards` |
| 410 | `expired` | The mail expired before it was claimed |
| 410 | `campaign_closed` | Pre-registration is over |
| 500 | `internal` | Unexpected server error |

### Types

```ts
type Locale = 'vi' | 'en';
type Reward = { type: 'gem'; amount: number }; // more types may come; clients ignore unknown types
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

Authentication required. Body: `{ "locale": "vi" }`. Idempotent: calling it again never creates a second registration or a second mail.

- `201` → `{ "status": "created", "registeredAt": "2026-11-04T08:00:00Z", "campaignKey": "prereg-launch" }`: registration and reward mail created.
- `200` → `{ "status": "existing", "registeredAt": "2026-11-04T08:00:00Z", "campaignKey": "prereg-launch" }`
- `410` → `campaign_closed`

### `GET /mail?locale=vi`

Authentication required. Newest first; includes claimed and expired mail. `title` and `body` are resolved for `locale` (default `vi`).

`200` →

```json
{
  "items": [
    {
      "id": "6b0d7c1e-1c0a-4f5e-9f7e-2d8a1b3c4d5e",
      "campaignKey": "prereg-launch",
      "title": "Quà đăng ký sớm",
      "body": "Cảm ơn bạn đã đăng ký sớm Promuse!",
      "rewards": [{ "type": "gem", "amount": 1800 }],
      "createdAt": "2026-11-04T08:00:00Z",
      "expiresAt": null,
      "claimedAt": null
    }
  ]
}
```

### `POST /mail/{mailId}/claim`

Authentication required. `mailId` is a UUID.

- `200` → `{ "mailId": "6b0d7c1e-…", "rewards": [{ "type": "gem", "amount": 1800 }], "claimedAt": "2026-11-20T10:00:00Z" }`
- `409` → `already_claimed`, with `details: { "claimedAt": "…", "rewards": [ … ] }`
- `410` → `expired`
- `404` → `not_found`

## Rules for the game client (later)

1. Sign in to the same Supabase project with the same Google account the player used on the web, then call this API with the access token. Refresh the token before it expires.
2. Apply rewards keyed by `mailId`, exactly once, and keep the applied ids in the save data. If a claim response is lost and the retry returns `409 already_claimed`, apply the rewards from `details` only when that id is not in the save yet.
3. Ignore reward types you do not know, and log them.
4. Native apps are not subject to CORS. A WebGL build would need CORS headers on `/api/v1` first.

## Trying it with curl

During development, `/dev/token` (404 in production) shows the access token of the signed-in browser session.

```bash
TOKEN="<access token>"
BASE="http://localhost:3000/api/v1"

curl -s "$BASE/mail?locale=en" -H "Authorization: Bearer $TOKEN"
curl -s -X POST "$BASE/mail/<mailId>/claim" -H "Authorization: Bearer $TOKEN"
```
