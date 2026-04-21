"use client";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setStatus(error ? error.message : "Reset link sent.");
  }
  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl border border-white/10 bg-white/5 p-6">
      <h1 className="mb-4 text-xl font-semibold">Forgot password</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded bg-black/30 p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {status ? <p className="text-sm text-zinc-300">{status}</p> : null}
        <button className="w-full rounded bg-blue-600 p-2">Send reset email</button>
      </form>
    </div>
  );
}
