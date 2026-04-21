import { Section, Card } from "@/components/ui";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const [users, subscriptions, usage] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }),
    supabase.from("usage_ledger").select("*", { count: "exact", head: true }),
  ]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Users" value={String(users.count ?? 0)} />
        <Card title="Subscriptions" value={String(subscriptions.count ?? 0)} />
        <Card title="Usage Events" value={String(usage.count ?? 0)} />
      </div>
      <Section title="System Monitoring">
        <p className="text-sm text-zinc-300">
          Use centralized logs, traces, and queue health dashboards to monitor retries, failures, and integration latency.
        </p>
      </Section>
    </div>
  );
}
