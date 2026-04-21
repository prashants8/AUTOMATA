import { NextResponse } from "next/server";
import { executeAgentCommand } from "@/server/services/agent-orchestrator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await executeAgentCommand(body);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
