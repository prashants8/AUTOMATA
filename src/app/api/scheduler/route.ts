import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { contentId, scheduledAt } = await req.json();
  const { data, error } = await supabase
    .from("content")
    .update({ status: "scheduled", scheduled_at: scheduledAt })
    .eq("id", contentId)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
