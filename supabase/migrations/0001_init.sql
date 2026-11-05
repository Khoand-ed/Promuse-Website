-- Pre-registration: campaigns, registrations and the one function that writes them.
-- doc/ARCHITECTURE.md, section 9. Never edit this file once it has been applied; add a new migration.

create table public.campaigns (
  key        text primary key,                          -- 'prereg-launch'
  kind       text not null check (kind in ('preregistration')),
  title      jsonb not null,                            -- {"vi": "...", "en": "..."}, for admin views
  rewards    jsonb not null,                            -- [{"type": "gacha_currency", "amount": 1800}]
  starts_at  timestamptz not null default now(),
  ends_at    timestamptz                                -- null: open-ended
);

create table public.preregistrations (
  user_id      uuid not null references auth.users (id) on delete cascade,
  campaign_key text not null references public.campaigns (key),
  email        text not null,
  google_sub   text not null,                           -- Google account id: the key the game uses later (section 17)
  locale       text not null check (locale in ('vi', 'en')),
  created_at   timestamptz not null default now(),
  primary key (user_id, campaign_key),
  unique (google_sub, campaign_key)
);

alter table public.campaigns        enable row level security;
alter table public.preregistrations enable row level security;

create policy "read own preregistrations" on public.preregistrations
  for select to authenticated using (user_id = (select auth.uid()));

-- Privileges are explicit, so the result does not depend on the project's default grants.
-- Clients get no access to campaigns, and may only read registrations (RLS keeps that to their own
-- rows). Writes go through the function below.
revoke all on public.campaigns, public.preregistrations from anon, authenticated;
grant select on public.preregistrations to authenticated;

-- Registers the signed-in user for the current pre-registration campaign, once.
-- Returns {"status": "created" | "existing", "registeredAt", "campaignKey"} or {"status": "campaign_closed"}.
create function public.register_preregistration(p_locale text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id    uuid := auth.uid();
  v_campaign   public.campaigns%rowtype;
  v_created_at timestamptz;
  v_email      text;
  v_google_sub text;
begin
  if v_user_id is null then
    raise exception 'register_preregistration: not signed in' using errcode = '28000';
  end if;
  if p_locale is null or p_locale not in ('vi', 'en') then
    raise exception 'register_preregistration: invalid locale' using errcode = '22023';
  end if;

  -- The current campaign is the latest one of its kind.
  select * into v_campaign
    from public.campaigns
   where kind = 'preregistration'
   order by starts_at desc
   limit 1;
  if not found then
    return jsonb_build_object('status', 'campaign_closed');
  end if;

  -- An existing registration is reported even once the campaign has ended.
  select created_at into v_created_at
    from public.preregistrations
   where user_id = v_user_id and campaign_key = v_campaign.key;
  if found then
    return jsonb_build_object('status', 'existing', 'registeredAt', v_created_at, 'campaignKey', v_campaign.key);
  end if;

  if v_campaign.starts_at > now() or v_campaign.ends_at <= now() then
    return jsonb_build_object('status', 'campaign_closed');
  end if;

  select email into v_email from auth.users where id = v_user_id;
  select provider_id into v_google_sub
    from auth.identities
   where user_id = v_user_id and provider = 'google'
   limit 1;
  if v_email is null or v_google_sub is null then
    raise exception 'register_preregistration: the account has no email or Google identity';
  end if;

  insert into public.preregistrations (user_id, campaign_key, email, google_sub, locale)
  values (v_user_id, v_campaign.key, v_email, v_google_sub, p_locale)
  on conflict do nothing
  returning created_at into v_created_at;
  if v_created_at is not null then
    return jsonb_build_object('status', 'created', 'registeredAt', v_created_at, 'campaignKey', v_campaign.key);
  end if;

  -- A parallel request won the insert.
  select created_at into v_created_at
    from public.preregistrations
   where user_id = v_user_id and campaign_key = v_campaign.key;
  if not found then
    raise exception 'register_preregistration: this Google account is registered under another user';
  end if;
  return jsonb_build_object('status', 'existing', 'registeredAt', v_created_at, 'campaignKey', v_campaign.key);
end;
$$;

revoke all on function public.register_preregistration(text) from public, anon;
grant execute on function public.register_preregistration(text) to authenticated;
