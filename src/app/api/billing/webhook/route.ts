import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/server/integrations/stripe";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  if (event.type.startsWith("customer.subscription")) {
    const supabase = createSupabaseAdminClient();
    const subscription = event.data.object as {
      id: string;
      status: string;
      metadata?: Record<string, string>;
    };
    const userId = subscription.metadata?.userId;
    const plan = subscription.metadata?.plan ?? "PRO";
    if (userId) {
      await supabase.from("subscriptions").upsert(
        {
          id: subscription.id,
          user_id: userId,
          plan,
          status: subscription.status,
          credits_remaining: plan === "PRO" ? 1000 : plan === "AGENCY" ? 5000 : 20000,
        },
        { onConflict: "id" },
      );
    }
    await supabase.from("webhook_events").insert({
      provider: "stripe",
      signature,
      payload: event,
      processed: true,
    });
  }
  return NextResponse.json({ ok: true });
}
