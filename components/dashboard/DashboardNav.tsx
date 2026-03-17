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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export interface DashboardUserProps {
  email: string;
  name: string;
  plan: "free" | "pro" | "team";
  auditsUsed?: number;
  auditsLimit?: number;
}

interface DashboardNavProps {
  user: DashboardUserProps;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderGit2 },
  { href: "/dashboard/history", label: "History", icon: History },
];

const accountNavItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavContent({
  user,
  pathname,
  handleSignOut,
  collapsed,
  onToggleCollapse,
}: {
  user: DashboardUserProps;
  pathname: string;
  handleSignOut: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
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
      {/* Logo + collapse toggle */}
      <div
        className={`p-6 pb-4 flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-6 flex items-center justify-center bg-indigo-950 border border-magenta/40 rounded-sm rotate-45 group-hover:border-magenta transition-all shrink-0">
              <CheckCircle className="size-3.5 text-magenta -rotate-45" />
            </div>
            <span className="text-lg font-mono font-bold tracking-tighter text-foreground uppercase glow-text-magenta">
              VibeCheck
            </span>
          </Link>
        )}
        <button
          onClick={onToggleCollapse}
          className={`hidden md:flex items-center justify-center rounded-lg transition-all cursor-pointer ${
            collapsed
              ? "px-3 py-2.5 border border-transparent text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              : "size-7 border border-indigo-900/50 bg-indigo-950/40 text-muted-foreground hover:text-magenta hover:border-magenta/40"
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      {/* Plan badge + usage */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <div className="rpg-panel p-4 bg-indigo-950/40 border-indigo-900/50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] font-bold px-2 py-0.5 border border-magenta/30 bg-magenta/5 text-magenta uppercase tracking-widest">
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
      )}

      {/* New Audit CTA */}
      <div className={collapsed ? "px-2 pb-4" : "px-4 pb-4"}>
        <Link
          href="/audit"
          className={`rpg-button rpg-button-primary flex items-center justify-center ${
            collapsed ? "size-10 !px-0 mx-auto" : "w-full gap-2 text-xs"
          }`}
        >
          <Plus className="size-4 shrink-0" />
          {!collapsed && "New Audit"}
        </Link>
      </div>

      {/* Main nav items */}
      <nav className="flex-1 px-3">
        {!collapsed && (
          <div className="mb-2 px-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-magenta/60">
              Navigation
            </span>
          </div>
        )}
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
              className={`relative flex items-center gap-3 ${
                collapsed ? "justify-center" : ""
              } px-3 py-2.5 mb-1.5 rounded-lg font-mono text-[11px] uppercase tracking-widest transition-all duration-200 border border-transparent ${
                isActive
                  ? "bg-indigo-950/60 border-indigo-800/50 text-magenta"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-magenta shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
              )}
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-6 border-t border-indigo-900/30" />

        {!collapsed && (
          <div className="mb-2 px-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-magenta/60">
              Account
            </span>
          </div>
        )}
        {accountNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 ${
                collapsed ? "justify-center" : ""
              } px-3 py-2.5 mb-1.5 rounded-lg font-mono text-[11px] uppercase tracking-widest transition-all duration-200 border border-transparent ${
                isActive
                  ? "bg-indigo-950/60 border-indigo-800/50 text-magenta"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-magenta shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
              )}
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + Sign out */}
      <div className="px-3 py-4 border-t border-indigo-900/30 bg-indigo-950/20">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4">
            <div className="size-8 bg-indigo-950 border border-indigo-800 flex items-center justify-center text-magenta font-mono text-xs font-bold rotate-45 rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.3)] shrink-0">
              <span className="-rotate-45">
                {user.name[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-tight truncate text-foreground">
                {user.name}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-tighter truncate text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className={`flex items-center justify-center gap-2 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 hover:bg-red-900/40 hover:border-red-500/50 hover:text-red-300 font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
            collapsed ? "w-full p-2.5" : "px-3 py-2 w-full"
          }`}
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </>
  );
}

export function DashboardNav({
  user,
  collapsed,
  onToggleCollapse,
}: DashboardNavProps) {
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
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 rounded-lg bg-indigo-950/80 backdrop-blur-xl border border-indigo-900/50 flex items-center justify-center text-foreground shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5 text-magenta" />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 border-r border-indigo-900/50 bg-background/40 backdrop-blur-xl z-40 transition-all duration-300 ${
          collapsed ? "w-16" : "w-72"
        }`}
      >
        <div className="absolute inset-0 rpg-grid opacity-5 pointer-events-none" />
        <NavContent
          user={user}
          pathname={pathname}
          handleSignOut={handleSignOut}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
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
                collapsed={false}
                onToggleCollapse={onToggleCollapse}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
