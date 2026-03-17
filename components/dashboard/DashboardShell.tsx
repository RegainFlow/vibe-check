"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import type { DashboardUserProps } from "@/components/dashboard/DashboardNav";

const pageNames: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/projects": "Projects",
  "/dashboard/history": "History",
  "/dashboard/settings": "Settings",
};

export function DashboardShell({
  user,
  children,
}: {
  user: DashboardUserProps;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);
  const pathname = usePathname();
  const currentPage = pageNames[pathname] ?? "Dashboard";

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardNav
        user={user}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? "md:ml-16" : "md:ml-72"
        }`}
      >
        <main className="flex-1 p-6 pt-16 md:p-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-6">
            <Link href="/dashboard" className="text-magenta/60 hover:text-magenta transition-colors">Dashboard</Link>
            {currentPage !== "Overview" && (
              <>
                <span className="text-indigo-900 mx-1">/</span>
                <Link href={pathname} className="text-foreground font-bold hover:text-magenta transition-colors">{currentPage}</Link>
              </>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
