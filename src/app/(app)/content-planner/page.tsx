import { Section } from "@/components/ui";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentWorkspaceId } from "@/server/services/workspace-service";

export default async function ContentPlannerPage() {
  const workspaceId = await getCurrentWorkspaceId();
  if (!workspaceId) return <div>Create a workspace first.</div>;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("content")
    .select("id,platform,type,status,scheduled_at")
    .eq("workspace_id", workspaceId)
    .order("scheduled_at", { ascending: true })
    .limit(20);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Content Planner</h1>
      <Section title="Upcoming Calendar Items">
        <div className="space-y-2 text-sm">
          {data?.map((item) => (
            <div key={item.id} className="rounded-md border border-white/10 p-3">
              {item.platform} - {item.type} - {item.status} -{" "}
              {item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : "unscheduled"}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
