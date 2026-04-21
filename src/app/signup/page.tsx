"use client";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createSupabaseBrowserClient();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) return setError(signUpError.message);
    if (!data.user) return setError("Unable to create user.");
    const { error: insertError } = await supabase.from("users").insert({ id: data.user.id, email, name });
    if (insertError) return setError(insertError.message);
    router.push("/onboarding");
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl border border-white/10 bg-white/5 p-6">
      <h1 className="mb-4 text-xl font-semibold">Signup</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded bg-black/30 p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full rounded bg-black/30 p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded bg-black/30 p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button className="w-full rounded bg-blue-600 p-2">Create Account</button>
      </form>
    </div>
  );
}
