import { NextResponse } from "next/server";
import { stripe } from "@/server/integrations/stripe";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  const { customerId } = (await req.json()) as { customerId: string };
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${env.APP_BASE_URL}/settings`,
  });
  return NextResponse.json({ url: session.url });
}
