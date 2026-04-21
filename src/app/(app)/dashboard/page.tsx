import { Card, Section } from "@/components/ui";
import { getDashboardMetrics } from "@/server/services/dashboard-service";
import { getCurrentWorkspaceId } from "@/server/services/workspace-service";

export default async function DashboardPage() {
  const workspaceId = await getCurrentWorkspaceId();
  if (!workspaceId) {
    return <div className="text-sm text-zinc-300">Create a workspace in Settings to start.</div>;
  }
  const metrics = await getDashboardMetrics(workspaceId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Content Created" value={String(metrics.content)} />
        <Card title="Scheduled Posts" value={String(metrics.scheduled)} />
        <Card title="Published Posts" value={String(metrics.published)} />
        <Card title="Leads Generated" value={String(metrics.leads)} />
        <Card title="Outreach Sent" value={String(metrics.outreach)} />
        <Card title="Replies Received" value={String(metrics.replies)} />
      </div>
      <Section title="AI Daily Suggestions">
        <ul className="list-disc space-y-2 pl-4 text-sm text-zinc-300">
          <li>Review top-performing posts and generate 3 variants.</li>
          <li>Schedule content around yesterday&apos;s best engagement slot.</li>
          <li>Run outreach follow-up for leads inactive for 72 hours.</li>
        </ul>
      </Section>
    </div>
  );
}
