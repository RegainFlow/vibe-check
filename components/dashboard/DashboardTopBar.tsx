"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

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
    <div className="h-14 border-b border-white/5 bg-background/60 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Dashboard</span>
        {currentPage !== "Overview" && (
          <>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground font-medium">{currentPage}</span>
          </>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full gradient-purple flex items-center justify-center text-white text-xs font-bold">
            {userName[0]?.toUpperCase() ?? "U"}
          </div>
          <span className="text-sm font-medium hidden sm:inline">{userName}</span>
        </div>
      </div>
    </div>
  );
}
