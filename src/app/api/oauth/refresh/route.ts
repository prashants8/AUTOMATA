import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  refreshProviderToken,
  SocialProvider,
} from "@/server/integrations/social-oauth";
import { decryptToken, encryptToken } from "@/server/security/token-vault";

type RefreshRequest = {
  connectionId: string;
  provider: SocialProvider;
};

export async function POST(req: Request) {
  const body = (await req.json()) as RefreshRequest;
  const supabase = await createSupabaseServerClient();
  const { data: row, error } = await supabase
    .from("oauth_connections")
    .select("id,refresh_ciphertext")
    .eq("id", body.connectionId)
    .single();
  if (error || !row?.refresh_ciphertext) {
    return NextResponse.json({ error: "No refresh token found" }, { status: 400 });
  }
  const refreshToken = decryptToken(row.refresh_ciphertext);
  const refreshed = await refreshProviderToken(body.provider, refreshToken);
  const { error: updateError } = await supabase
    .from("oauth_connections")
    .update({
      token_ciphertext: encryptToken(refreshed.access_token),
      refresh_ciphertext: refreshed.refresh_token
        ? encryptToken(refreshed.refresh_token)
        : row.refresh_ciphertext,
      expires_at: refreshed.expires_in
        ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
        : null,
    })
    .eq("id", body.connectionId);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
