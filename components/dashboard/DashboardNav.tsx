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
        <Link href="/" className="flex items-center gap-2">
          <CheckCircle className="size-5 text-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            VibeCheck
          </span>
        </Link>
      </div>

      {/* Plan badge + usage */}
      <div className="px-4 pb-4">
        <div className="rounded-xl border border-white/5 bg-background/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                planColors[user.plan]
              }`}
            >
              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
            </span>
          </div>
          {user.plan === "free" && (
            <>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Audits used</span>
                <span className="font-mono">
                  {auditsUsed}/{auditsLimit}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${usageColor} transition-all duration-500`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main nav items */}
      <nav className="flex-1 px-3">
        <div className="mb-2">
          <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
            Menu
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
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="dashboard-nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-4 border-t border-white/5" />

        <div className="mb-2">
          <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
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
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="dashboard-nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-sm font-bold">
            {user.name[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex-1 px-1"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
          <ThemeToggle />
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
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 rounded-lg bg-card/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-foreground"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-72 flex-col fixed inset-y-0 left-0 border-r border-white/5 bg-card/50 backdrop-blur-xl z-40">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-72 flex flex-col border-r border-white/5 bg-card/95 backdrop-blur-xl z-50 md:hidden"
            >
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
