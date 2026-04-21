import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function getCurrentWorkspaceId() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return null;
  }

  const { data } = await supabase
    .from("workspaces")
    .select("id")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data?.id ?? null;
}
