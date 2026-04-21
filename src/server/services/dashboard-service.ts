import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function getDashboardMetrics(workspaceId: string) {
  const supabase = await createSupabaseServerClient();

  const [
    contentCount,
    scheduledCount,
    publishedCount,
    leadsCount,
    outreachCount,
    repliesCount,
  ] = await Promise.all([
    supabase.from("content").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("content").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("status", "scheduled"),
    supabase.from("content").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("status", "published"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("outreach").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("outreach").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("status", "replied"),
  ]);

  return {
    content: contentCount.count ?? 0,
    scheduled: scheduledCount.count ?? 0,
    published: publishedCount.count ?? 0,
    leads: leadsCount.count ?? 0,
    outreach: outreachCount.count ?? 0,
    replies: repliesCount.count ?? 0,
  };
}
