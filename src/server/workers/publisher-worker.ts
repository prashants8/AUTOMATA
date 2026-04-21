import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { decryptToken } from "@/server/security/token-vault";
import { publishLinkedInPost } from "@/server/integrations/linkedin";

export async function runPublisherWorker() {
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();
  const { data: jobs } = await supabase
    .from("content")
    .select("id,workspace_id,platform,content_text")
    .eq("status", "scheduled")
    .lte("scheduled_at", now)
    .limit(25);

  for (const job of jobs ?? []) {
    try {
      const { data: oauth } = await supabase
        .from("oauth_connections")
        .select("id,token_ciphertext,provider")
        .eq("workspace_id", job.workspace_id)
        .eq("provider", job.platform.toLowerCase())
        .limit(1)
        .maybeSingle();

      if (!oauth) throw new Error("Missing OAuth connection");
      const accessToken = decryptToken(oauth.token_ciphertext);
      if (oauth.provider === "linkedin") {
        await publishLinkedInPost(accessToken, job.content_text);
      }
      await supabase
        .from("content")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", job.id);
    } catch (error) {
      await supabase.from("agent_jobs").insert({
        workspace_id: job.workspace_id,
        command_text: `publish ${job.id}`,
        module: "scheduler",
        status: "failed",
        payload: { contentId: job.id },
        result: { error: error instanceof Error ? error.message : "Unknown error" },
      });
    }
  }
}
