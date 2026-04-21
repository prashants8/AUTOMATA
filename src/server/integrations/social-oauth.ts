import { env } from "@/lib/env";

export type SocialProvider = "linkedin" | "meta" | "youtube" | "x";
const socialProviders: SocialProvider[] = ["linkedin", "meta", "youtube", "x"];

type ProviderConfig = {
  authUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
};

const providerConfig: Record<SocialProvider, ProviderConfig> = {
  linkedin: {
    authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    clientId: env.LINKEDIN_CLIENT_ID,
    clientSecret: env.LINKEDIN_CLIENT_SECRET,
    scopes: ["w_member_social", "r_liteprofile", "r_emailaddress"],
  },
  meta: {
    authUrl: "https://www.facebook.com/v20.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v20.0/oauth/access_token",
    clientId: env.META_CLIENT_ID,
    clientSecret: env.META_CLIENT_SECRET,
    scopes: ["pages_manage_posts", "instagram_content_publish", "pages_read_engagement"],
  },
  youtube: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    scopes: ["https://www.googleapis.com/auth/youtube.upload"],
  },
  x: {
    authUrl: "https://twitter.com/i/oauth2/authorize",
    tokenUrl: "https://api.x.com/2/oauth2/token",
    clientId: env.X_CLIENT_ID,
    clientSecret: env.X_CLIENT_SECRET,
    scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
  },
};

export function getProviderConfig(provider: SocialProvider) {
  return providerConfig[provider];
}

export function parseSocialProvider(input: string): SocialProvider | null {
  return socialProviders.includes(input as SocialProvider)
    ? (input as SocialProvider)
    : null;
}

export async function exchangeProviderCode(
  provider: SocialProvider,
  code: string,
  redirectUri: string,
) {
  const cfg = getProviderConfig(provider);
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
  });
  const response = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    throw new Error(`${provider} token exchange failed (${response.status})`);
  }
  return response.json();
}

export async function refreshProviderToken(provider: SocialProvider, refreshToken: string) {
  const cfg = getProviderConfig(provider);
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
  });
  const response = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    throw new Error(`${provider} token refresh failed (${response.status})`);
  }
  return response.json();
}
