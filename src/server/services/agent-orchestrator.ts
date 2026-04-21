import OpenAI from "openai";
import { z } from "zod";

import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const commandSchema = z.object({
  command: z.string().min(3),
  workspaceId: z.string().uuid(),
});

export async function executeAgentCommand(input: unknown) {
  const parsed = commandSchema.parse(input);
  const supabase = await createSupabaseServerClient();
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const ai = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `Break this command into JSON tasks by modules content,video,scheduler,leads,outreach: ${parsed.command}`,
  });
  const output = ai.output_text;

  const { data: job } = await supabase
    .from("agent_jobs")
    .insert({
      workspace_id: parsed.workspaceId,
      command_text: parsed.command,
      module: "orchestrator",
      status: "completed",
      payload: { command: parsed.command },
      result: { plan: output },
    })
    .select("id")
    .single();

  await supabase.from("ai_logs").insert({
    workspace_id: parsed.workspaceId,
    action: "command_execute",
    input: { command: parsed.command },
    output: { plan: output, jobId: job?.id },
  });

  return { jobId: job?.id, plan: output };
}
