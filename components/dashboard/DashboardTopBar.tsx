"use client";

import { usePathname } from "next/navigation";

interface DashboardTopBarProps {
  userName: string;
}

const pageNames: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/projects": "Projects",
  "/dashboard/history": "History",
  "/dashboard/settings": "Settings",
};

export function DashboardTopBar({ userName }: DashboardTopBarProps) {
  const pathname = usePathname();
  const currentPage = pageNames[pathname] ?? "Dashboard";

  return (
    <div className="h-14 border-b border-indigo-900/50 bg-indigo-950/20 backdrop-blur-xl flex items-center justify-between px-6 relative z-10">
      <div className="absolute inset-0 rpg-grid opacity-10 pointer-events-none" />
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest relative z-10">
        <span className="text-magenta/60">Dashboard</span>
        {currentPage !== "Overview" && (
          <>
            <span className="text-indigo-900 mx-1">/</span>
            <span className="text-foreground font-bold">{currentPage}</span>
          </>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="size-6 bg-indigo-950 border border-indigo-800 flex items-center justify-center text-magenta font-mono text-xs font-bold rotate-45 rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.3)]">
            <span className="-rotate-45">{userName[0]?.toUpperCase() ?? "U"}</span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-tight hidden sm:inline text-foreground">{userName}</span>
        </div>
      </div>
    </div>
  );
}
