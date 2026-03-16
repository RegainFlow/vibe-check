"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Plus,
  Settings,
  LogOut,
  FolderGit2,
  History,
  Menu,
  CheckCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardNavProps {
  user: {
    email: string;
    name: string;
    plan: "free" | "pro" | "team";
    auditsUsed?: number;
    auditsLimit?: number;
  };
}

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderGit2 },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/audit", label: "New Audit", icon: Plus },
];

const accountNavItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const planColors = {
  free: "bg-white/10 text-muted-foreground",
  pro: "bg-primary/20 text-primary",
  team: "bg-accent/20 text-accent",
};

function NavContent({
  user,
  pathname,
  handleSignOut,
}: {
  user: DashboardNavProps["user"];
  pathname: string;
  handleSignOut: () => void;
}) {
  const auditsUsed = user.auditsUsed ?? 0;
  const auditsLimit = user.auditsLimit ?? 3;
  const usagePercent = Math.min((auditsUsed / auditsLimit) * 100, 100);
  const usageColor =
    usagePercent >= 90
      ? "bg-red-500"
      : usagePercent >= 60
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <>
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-6 flex items-center justify-center bg-indigo-950 border border-magenta/40 rounded-sm rotate-45 group-hover:border-magenta transition-all">
            <CheckCircle className="size-3.5 text-magenta -rotate-45" />
          </div>
          <span className="text-lg font-mono font-bold tracking-tighter text-foreground uppercase glow-text-magenta">
            VibeCheck
          </span>
        </Link>
      </div>

      {/* Plan badge + usage */}
      <div className="px-4 pb-4">
        <div className="rpg-panel p-4 bg-indigo-950/40 border-indigo-900/50">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`font-mono text-[9px] font-bold px-2 py-0.5 border border-magenta/30 bg-magenta/5 text-magenta uppercase tracking-widest`}
            >
              {user.plan} account
            </span>
          </div>
          {user.plan === "free" && (
            <>
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
                <span>Usage</span>
                <span className="tabular-nums text-foreground">
                  {auditsUsed}/{auditsLimit}
                </span>
              </div>
              <div className="w-full h-1 bg-indigo-900/50 overflow-hidden">
                <div
                  className={`h-full ${usageColor} shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all duration-500`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main nav items */}
      <nav className="flex-1 px-3">
        <div className="mb-2 px-3">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-magenta/60">
            Navigation
          </span>
        </div>
        {mainNavItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-all duration-200 border border-transparent ${
                isActive
                  ? "bg-indigo-950/60 border-indigo-800/50 text-magenta"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-magenta shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
              )}
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-6 border-t border-indigo-900/30" />

        <div className="mb-2 px-3">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-magenta/60">
            Account
          </span>
        </div>
        {accountNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-all duration-200 border border-transparent ${
                isActive
                  ? "bg-indigo-950/60 border-indigo-800/50 text-magenta"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-magenta shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
              )}
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-indigo-900/30 bg-indigo-950/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 bg-indigo-950 border border-indigo-800 flex items-center justify-center text-magenta font-mono text-xs font-bold rotate-45 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
            <span className="-rotate-45">{user.name[0]?.toUpperCase() ?? "U"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-tight truncate text-foreground">{user.name}</p>
            <p className="font-mono text-[9px] uppercase tracking-tighter truncate text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-magenta transition-colors px-1"
          >
            <LogOut className="w-3 h-3" />
            Sign out
          </button>
          <div className="size-1.5 rounded-full bg-magenta/50 animate-pulse" />
        </div>
      </div>
    </>
  );
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 bg-indigo-950/80 backdrop-blur-xl border border-indigo-900/50 flex items-center justify-center text-foreground shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5 text-magenta" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-72 flex-col fixed inset-y-0 left-0 border-r border-indigo-900/50 bg-background/40 backdrop-blur-xl z-40">
        <div className="absolute inset-0 rpg-grid opacity-5 pointer-events-none" />
        <NavContent
          user={user}
          pathname={pathname}
          handleSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-[calc(100vw-3rem)] max-w-72 flex flex-col border-r border-indigo-900/50 bg-background/95 backdrop-blur-xl z-50 md:hidden"
            >
              <div className="absolute inset-0 rpg-grid opacity-5 pointer-events-none" />
              <NavContent
                user={user}
                pathname={pathname}
                handleSignOut={handleSignOut}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
