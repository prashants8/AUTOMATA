import { Section } from "@/components/ui";

export default function AiAgentsPage() {
  const examples = [
    "Create 7 posts and schedule them",
    "Find 50 leads and send outreach",
    "Create 5 posts + 2 reels + schedule",
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Agents</h1>
      <Section title="Command Execution">
        <p className="mb-3 text-sm text-zinc-300">Send natural-language commands through `/api/agents/execute`.</p>
        <ul className="list-disc space-y-1 pl-4 text-sm text-zinc-300">
          {examples.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
