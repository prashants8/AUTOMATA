import { NextResponse } from "next/server";
import { runPublisherWorker } from "@/server/workers/publisher-worker";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  const secret = req.headers.get("x-worker-secret");
  if (secret !== env.WORKER_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await runPublisherWorker();
  return NextResponse.json({ ok: true });
}
