import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

const baseUrl = process.env.E2E_BASE_URL;
const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ready = Boolean(baseUrl && email && password && supabaseUrl && supabaseAnon);

describe("live journey", () => {
  it.skipIf(!ready)("creates content, schedules, and executes agent command", async () => {
    const supabase = createClient(supabaseUrl!, supabaseAnon!);
    const { data: auth, error: loginError } = await supabase.auth.signInWithPassword({
      email: email!,
      password: password!,
    });
    expect(loginError).toBeNull();
    expect(auth.session?.access_token).toBeTruthy();
    expect(auth.user).toBeTruthy();

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.session!.access_token}`,
    };

    const workspace = await supabase
      .from("workspaces")
      .select("id")
      .eq("user_id", auth.user!.id)
      .limit(1)
      .single();
    expect(workspace.error).toBeNull();

    const contentRes = await fetch(`${baseUrl}/api/content`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        workspace_id: workspace.data!.id,
        type: "post",
        platform: "linkedin",
        content_text: "Live journey post",
      }),
    });
    expect(contentRes.status).toBe(200);
    const contentPayload = await contentRes.json();
    const contentId = contentPayload.data.id as string;

    const scheduleRes = await fetch(`${baseUrl}/api/scheduler`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        contentId,
        scheduledAt: new Date(Date.now() + 30_000).toISOString(),
      }),
    });
    expect(scheduleRes.status).toBe(200);

    const agentRes = await fetch(`${baseUrl}/api/agents/execute`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        command: "Create 3 posts and schedule them",
        workspaceId: workspace.data!.id,
      }),
    });
    expect(agentRes.status).toBe(200);
    const agentPayload = await agentRes.json();
    expect(agentPayload.jobId).toBeTruthy();
  });
});
