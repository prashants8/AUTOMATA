import { Section } from "@/components/ui";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentWorkspaceId } from "@/server/services/workspace-service";

export default async function VideoStudioPage() {
  const workspaceId = await getCurrentWorkspaceId();
  if (!workspaceId) return <div>Create a workspace first.</div>;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("videos")
    .select("id,status,video_url,created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Video Studio</h1>
      <Section title="Generated Videos">
        <div className="space-y-2 text-sm">
          {data?.map((video) => (
            <div key={video.id} className="rounded-md border border-white/10 p-3">
              {video.status} - {video.video_url ?? "pending upload"}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
