"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, PenSquare, Clapperboard, Share2, Users, LineChart, Bot, Settings } from "lucide-react";
import clsx from "clsx";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/content-planner", label: "Content Planner", icon: Calendar },
  { href: "/ai-writer", label: "AI Writer", icon: PenSquare },
  { href: "/video-studio", label: "Video Studio", icon: Clapperboard },
  { href: "/social-scheduler", label: "Social Scheduler", icon: Share2 },
  { href: "/leads-outreach", label: "Leads & Outreach", icon: Users },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/ai-agents", label: "AI Agents", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#080A10] text-zinc-100">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 h-screen w-72 border-r border-white/10 bg-white/5 p-4 backdrop-blur">
          <h1 className="mb-6 text-xl font-semibold">AUTOMATA</h1>
          <nav className="space-y-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                  pathname === href
                    ? "bg-blue-500/25 text-blue-200"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
