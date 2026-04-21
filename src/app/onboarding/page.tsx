"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    brand_name: "",
    industry: "",
    target_audience: "",
    tone: "",
    platforms: "",
    website: "",
    offer_service: "",
  });
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createSupabaseBrowserClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return setError("Please login first.");
    const { error: insertError } = await supabase.from("workspaces").insert({
      user_id: auth.user.id,
      brand_name: form.brand_name,
      industry: form.industry,
      target_audience: form.target_audience,
      tone: form.tone,
      platforms: form.platforms.split(",").map((p) => p.trim()).filter(Boolean),
      website: form.website,
      offer_service: form.offer_service,
    });
    if (insertError) return setError(insertError.message);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-xl border border-white/10 bg-white/5 p-6">
      <h1 className="mb-4 text-xl font-semibold">Onboarding</h1>
      <form onSubmit={onSubmit} className="space-y-2">
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            className="w-full rounded bg-black/30 p-2"
            placeholder={key}
            value={value}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
          />
        ))}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button className="mt-3 w-full rounded bg-blue-600 p-2">Save workspace memory</button>
      </form>
    </div>
  );
}
