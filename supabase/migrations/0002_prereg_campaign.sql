-- The launch pre-registration campaign (doc/ARCHITECTURE.md, section 9). A migration rather than
-- seed.sql, so production gets the row too. Changing the reward later takes a new migration.
insert into public.campaigns (key, kind, title, rewards)
values (
  'prereg-launch',
  'preregistration',
  '{"vi": "Quà đăng ký sớm", "en": "Pre-registration reward"}',
  -- 1800 confirmed by the owner on 2026-11-05. reward.desc in content/text must name the same amount.
  '[{"type": "gacha_currency", "amount": 1800}]'
);
