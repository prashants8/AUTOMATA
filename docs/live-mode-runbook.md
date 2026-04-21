# Live-Mode Runbook

## 1) Install CLIs
```powershell
npm install -g supabase vercel
```

## 2) Configure Supabase and run migrations
```powershell
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

## 3) Set local environment
Copy `.env.example` to `.env.local` and set all values.

## 4) Set Vercel production environment
```powershell
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add SUPABASE_DB_URL production
vercel env add OPENAI_API_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_PRICE_PRO_ID production
vercel env add STRIPE_PRICE_AGENCY_ID production
vercel env add STRIPE_PRICE_ENTERPRISE_ID production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add RESEND_API_KEY production
vercel env add TOKEN_ENCRYPTION_KEY production
vercel env add APP_BASE_URL production
vercel env add LINKEDIN_CLIENT_ID production
vercel env add LINKEDIN_CLIENT_SECRET production
vercel env add META_CLIENT_ID production
vercel env add META_CLIENT_SECRET production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add X_CLIENT_ID production
vercel env add X_CLIENT_SECRET production
vercel env add WORKER_SECRET production
```

## 5) Deploy
```powershell
vercel --prod
```

## 6) Configure OAuth redirect URLs
- LinkedIn: `https://<your-domain>/api/oauth/callback/linkedin`
- Meta: `https://<your-domain>/api/oauth/callback/meta`
- Google/YouTube: `https://<your-domain>/api/oauth/callback/youtube`
- X: `https://<your-domain>/api/oauth/callback/x`

## 7) Configure Stripe webhook
Endpoint: `https://<your-domain>/api/billing/webhook`
Events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 8) Execute E2E journey test
```powershell
$env:E2E_BASE_URL="https://<your-domain>"
$env:E2E_USER_EMAIL="<test-user-email>"
$env:E2E_USER_PASSWORD="<test-user-password>"
$env:NEXT_PUBLIC_SUPABASE_URL="<supabase-url>"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
npm run test:e2e
```
