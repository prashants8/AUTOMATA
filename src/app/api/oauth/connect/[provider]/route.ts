import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getProviderConfig, SocialProvider } from "@/server/integrations/social-oauth";
import { env } from "@/lib/env";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ provider: SocialProvider }> },
) {
  const { provider } = await params;
  const cfg = getProviderConfig(provider);
  const state = crypto.randomUUID();
  const redirectUri = `${env.APP_BASE_URL}/api/oauth/callback/${provider}`;
  const authUrl = new URL(cfg.authUrl);
  authUrl.searchParams.set("client_id", cfg.clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", cfg.scopes.join(" "));
  authUrl.searchParams.set("state", state);
  if (provider === "youtube") authUrl.searchParams.set("access_type", "offline");
  return NextResponse.json({ url: authUrl.toString(), state });
}
