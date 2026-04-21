create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  brand_name text not null,
  industry text not null,
  tone text not null,
  target_audience text not null,
  platforms text[] not null default '{}',
  website text,
  offer_service text,
  created_at timestamptz not null default now()
);

create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  type text not null,
  platform text not null,
  content_text text not null,
  status text not null default 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  script_id uuid references public.content(id) on delete set null,
  video_url text,
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  platform text not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique(workspace_id, platform)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  email text,
  company text,
  status text not null default 'new',
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.outreach (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  message text not null,
  type text not null,
  status text not null default 'queued',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  metric_name text not null,
  value numeric not null,
  recorded_at timestamptz not null default now()
);

create table if not exists public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  action text not null,
  input jsonb not null,
  output jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan text not null,
  status text not null,
  credits_remaining integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.agent_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  command_text text not null,
  module text not null,
  status text not null default 'queued',
  payload jsonb not null,
  result jsonb,
  retry_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.events_outbox (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz
);

create table if not exists public.oauth_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  provider text not null,
  external_account_id text not null,
  scopes text[] not null default '{}',
  token_ciphertext text not null,
  refresh_ciphertext text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique(workspace_id, provider, external_account_id)
);

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  signature text not null,
  payload jsonb not null,
  processed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_ledger (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  meter text not null,
  units numeric not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  delta integer not null,
  reason text not null,
  job_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.idempotency_keys (
  key text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  response jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.workspaces enable row level security;
alter table public.content enable row level security;
alter table public.videos enable row level security;
alter table public.social_accounts enable row level security;
alter table public.leads enable row level security;
alter table public.outreach enable row level security;
alter table public.analytics enable row level security;
alter table public.ai_logs enable row level security;
alter table public.subscriptions enable row level security;
alter table public.workspaces_members enable row level security;
alter table public.agent_jobs enable row level security;
alter table public.events_outbox enable row level security;
alter table public.oauth_connections enable row level security;
alter table public.webhook_events enable row level security;
alter table public.usage_ledger enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.idempotency_keys enable row level security;

create policy "users_select_self" on public.users for select using (id = auth.uid());
create policy "users_update_self" on public.users for update using (id = auth.uid());
create policy "users_insert_self" on public.users for insert with check (id = auth.uid());

create policy "workspace_access" on public.workspaces
for all using (
  user_id = auth.uid() or exists (
    select 1 from public.workspaces_members wm
    where wm.workspace_id = workspaces.id and wm.user_id = auth.uid()
  )
);

create policy "workspace_members_access" on public.workspaces_members
for all using (user_id = auth.uid() or exists (
  select 1 from public.workspaces w where w.id = workspace_id and w.user_id = auth.uid()
));

create policy "content_access" on public.content
for all using (exists (
  select 1 from public.workspaces w
  where w.id = content.workspace_id and (
    w.user_id = auth.uid() or exists (
      select 1 from public.workspaces_members wm
      where wm.workspace_id = w.id and wm.user_id = auth.uid()
    )
  )
));

create policy "videos_access" on public.videos for all using (exists (select 1 from public.workspaces w where w.id = videos.workspace_id and w.user_id = auth.uid()));
create policy "social_access" on public.social_accounts for all using (exists (select 1 from public.workspaces w where w.id = social_accounts.workspace_id and w.user_id = auth.uid()));
create policy "leads_access" on public.leads for all using (exists (select 1 from public.workspaces w where w.id = leads.workspace_id and w.user_id = auth.uid()));
create policy "outreach_access" on public.outreach for all using (exists (select 1 from public.workspaces w where w.id = outreach.workspace_id and w.user_id = auth.uid()));
create policy "analytics_access" on public.analytics for all using (exists (select 1 from public.workspaces w where w.id = analytics.workspace_id and w.user_id = auth.uid()));
create policy "ai_logs_access" on public.ai_logs for all using (exists (select 1 from public.workspaces w where w.id = ai_logs.workspace_id and w.user_id = auth.uid()));
create policy "agent_jobs_access" on public.agent_jobs for all using (exists (select 1 from public.workspaces w where w.id = agent_jobs.workspace_id and w.user_id = auth.uid()));
create policy "events_outbox_access" on public.events_outbox for all using (exists (select 1 from public.workspaces w where w.id = events_outbox.workspace_id and w.user_id = auth.uid()));
create policy "oauth_access" on public.oauth_connections for all using (exists (select 1 from public.workspaces w where w.id = oauth_connections.workspace_id and w.user_id = auth.uid()));
create policy "usage_access" on public.usage_ledger for all using (exists (select 1 from public.workspaces w where w.id = usage_ledger.workspace_id and w.user_id = auth.uid()));
create policy "credit_access" on public.credit_ledger for all using (exists (select 1 from public.workspaces w where w.id = credit_ledger.workspace_id and w.user_id = auth.uid()));
create policy "idempotency_access" on public.idempotency_keys for all using (exists (select 1 from public.workspaces w where w.id = idempotency_keys.workspace_id and w.user_id = auth.uid()));
create policy "subscriptions_access" on public.subscriptions for all using (user_id = auth.uid());

create index if not exists idx_content_workspace_status on public.content(workspace_id, status);
create index if not exists idx_leads_workspace_status on public.leads(workspace_id, status);
create index if not exists idx_outreach_workspace_status on public.outreach(workspace_id, status);
create index if not exists idx_agent_jobs_workspace_status on public.agent_jobs(workspace_id, status);
create index if not exists idx_analytics_workspace_recorded on public.analytics(workspace_id, recorded_at desc);
