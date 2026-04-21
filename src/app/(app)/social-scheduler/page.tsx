import { Section } from "@/components/ui";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentWorkspaceId } from "@/server/services/workspace-service";

export default async function SocialSchedulerPage() {
  const workspaceId = await getCurrentWorkspaceId();
  if (!workspaceId) return <div>Create a workspace first.</div>;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("social_accounts")
    .select("id,platform,created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Social Scheduler</h1>
      <Section title="Connected Social Accounts">
        <div className="space-y-2 text-sm">
          {data?.map((acct) => (
            <div key={acct.id} className="rounded-md border border-white/10 p-3">
              {acct.platform}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
