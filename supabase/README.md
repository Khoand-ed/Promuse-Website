# Database

The website's Supabase project, in Tokyo (`ap-northeast-1`). The schema is in `doc/ARCHITECTURE.md`, section 9.

## Applying a migration

Migrations are applied by hand, in file order, from the dashboard: **SQL Editor → New query**, paste the whole file, **Run**. There is no Supabase CLI in this project, so nothing records applied files except the table below. Update it in the same pull request.

Never edit a file that has been applied; add a new one with the next number.

| File | Applied to the project on |
|---|---|
| `0001_init.sql` | 2026-11-05 |
| `0002_prereg_campaign.sql` | 2026-11-05 |
