# AUTOMATA Production Architecture

## Stack
- Next.js App Router + TypeScript
- Supabase Auth + Postgres + RLS + Storage + Edge Functions
- OpenAI orchestration for agent planning
- Stripe for subscriptions, Resend for email outreach

## Modules
- `src/app/(app)` for product surfaces
- `src/app/api/*` route handlers for module APIs
- `src/server/services/*` business logic and orchestration
- `src/server/integrations/*` external adapter boundaries
- `supabase/migrations/*` schema, indexes, and RLS policies

## Deployment
1. Create Supabase project and run migration `supabase/migrations/0001_init.sql`.
2. Configure OAuth providers in Supabase (Google + social providers).
3. Set env vars from `.env.example` in Vercel and worker runtime.
4. Deploy Next.js app to Vercel with protected production env.
5. Configure Stripe webhook to `/api/billing/webhook`.
6. Monitor queue, failures, and API latency in observability stack.
