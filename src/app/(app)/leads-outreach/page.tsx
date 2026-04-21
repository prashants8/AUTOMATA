import { Section } from "@/components/ui";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentWorkspaceId } from "@/server/services/workspace-service";

export default async function LeadsOutreachPage() {
  const workspaceId = await getCurrentWorkspaceId();
  if (!workspaceId) return <div>Create a workspace first.</div>;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("leads")
    .select("id,name,email,company,status")
    .eq("workspace_id", workspaceId)
    .limit(50);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Leads & Outreach</h1>
      <Section title="Lead Database">
        <div className="space-y-2 text-sm">
          {data?.map((lead) => (
            <div key={lead.id} className="rounded-md border border-white/10 p-3">
              {lead.name} ({lead.company}) - {lead.status} - {lead.email}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
