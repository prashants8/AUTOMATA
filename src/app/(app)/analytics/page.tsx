import { Section } from "@/components/ui";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentWorkspaceId } from "@/server/services/workspace-service";

export default async function AnalyticsPage() {
  const workspaceId = await getCurrentWorkspaceId();
  if (!workspaceId) return <div>Create a workspace first.</div>;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("analytics")
    .select("id,metric_name,value,recorded_at")
    .eq("workspace_id", workspaceId)
    .order("recorded_at", { ascending: false })
    .limit(30);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <Section title="Recent Metrics">
        <div className="space-y-2 text-sm">
          {data?.map((metric) => (
            <div key={metric.id} className="rounded-md border border-white/10 p-3">
              {metric.metric_name}: {metric.value} ({new Date(metric.recorded_at).toLocaleString()})
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
