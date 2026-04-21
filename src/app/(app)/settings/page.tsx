import { Section } from "@/components/ui";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return <div>Please log in.</div>;
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("brand_name,industry,target_audience,tone,website,offer_service")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Section title="Workspace AI Memory">
        <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/30 p-3 text-xs">
          {JSON.stringify(workspace ?? {}, null, 2)}
        </pre>
      </Section>
    </div>
  );
}
