import { NextResponse } from "next/server";
import { stripe } from "@/server/integrations/stripe";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const prices: Record<string, string> = {
  PRO: env.STRIPE_PRICE_PRO_ID,
  AGENCY: env.STRIPE_PRICE_AGENCY_ID,
  ENTERPRISE: env.STRIPE_PRICE_ENTERPRISE_ID,
};

export async function POST(req: Request) {
  const { plan } = (await req.json()) as { plan: "PRO" | "AGENCY" | "ENTERPRISE" };
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: prices[plan], quantity: 1 }],
    success_url: `${env.APP_BASE_URL}/settings?billing=success`,
    cancel_url: `${env.APP_BASE_URL}/settings?billing=cancelled`,
    metadata: { userId: auth.user.id, plan },
  });
  return NextResponse.json({ url: session.url });
}
