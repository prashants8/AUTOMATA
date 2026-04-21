import { retryWithBackoff } from "@/server/utils/retry";

const LINKEDIN_API = "https://api.linkedin.com/v2";

export async function publishLinkedInPost(accessToken: string, text: string) {
  return retryWithBackoff(async () => {
    const res = await fetch(`${LINKEDIN_API}/ugcPosts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ specificContent: { "com.linkedin.ugc.ShareContent": { shareCommentary: { text } } } }),
    });
    if (!res.ok) throw new Error(`LinkedIn publish failed: ${res.status}`);
    return res.json();
  });
}
