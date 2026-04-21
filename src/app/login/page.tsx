"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setLoading(false);
      return setError(signInError.message);
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function onGoogleSignIn() {
    const supabase = createSupabaseBrowserClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl border border-white/10 bg-white/5 p-6">
      <h1 className="mb-4 text-xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded bg-black/30 p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded bg-black/30 p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 p-2 disabled:opacity-60">
          {loading ? "Logging in..." : "Login"}
        </button>
        <button type="button" onClick={onGoogleSignIn} className="w-full rounded border border-white/20 p-2">
          Continue with Google
        </button>
        <p className="text-sm text-zinc-300">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-300 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
