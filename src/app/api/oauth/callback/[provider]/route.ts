import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  exchangeProviderCode,
  getProviderConfig,
  parseSocialProvider,
} from "@/server/integrations/social-oauth";
import { encryptToken } from "@/server/security/token-vault";
import { env } from "@/lib/env";
import { getCurrentWorkspaceId } from "@/server/services/workspace-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: rawProvider } = await params;
  const provider = parseSocialProvider(rawProvider);
  if (!provider) {
    return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  const redirectUri = `${env.APP_BASE_URL}/api/oauth/callback/${provider}`;
  const tokenPayload = await exchangeProviderCode(provider, code, redirectUri);
  const supabase = await createSupabaseServerClient();
  const workspaceId = await getCurrentWorkspaceId();
  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 400 });
  }

  const cfg = getProviderConfig(provider);
  const accessCipher = encryptToken(tokenPayload.access_token);
  const refreshCipher = tokenPayload.refresh_token
    ? encryptToken(tokenPayload.refresh_token)
    : null;
  const expiresAt = tokenPayload.expires_in
    ? new Date(Date.now() + tokenPayload.expires_in * 1000).toISOString()
    : null;

  const { error } = await supabase.from("oauth_connections").upsert(
    {
      workspace_id: workspaceId,
      provider,
      external_account_id: tokenPayload.user_id ?? tokenPayload.id ?? "self",
      scopes: cfg.scopes,
      token_ciphertext: accessCipher,
      refresh_ciphertext: refreshCipher,
      expires_at: expiresAt,
    },
    { onConflict: "workspace_id,provider,external_account_id" },
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.redirect(new URL("/social-scheduler", env.APP_BASE_URL));
}
