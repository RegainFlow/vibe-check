"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import ScoreGauge from "@/components/audit/ScoreGauge";
import type { Audit } from "@/types/audit";

interface AuditHistoryProps {
  audits: Audit[];
}

function getStatusConfig(status: Audit["status"]) {
  switch (status) {
    case "completed":
      return {
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-success" />,
        badge: "bg-green-500/10 text-green-400 border-green-500/20",
        label: "Completed",
      };
    case "failed":
      return {
        icon: <XCircle className="w-3.5 h-3.5 text-destructive" />,
        badge: "bg-red-500/10 text-red-400 border-red-500/20",
        label: "Failed",
      };
    case "pending":
      return {
        icon: <Clock className="w-3.5 h-3.5 text-muted-foreground" />,
        badge: "bg-white/5 text-muted-foreground border-white/10",
        label: "Pending",
      };
    default:
      return {
        icon: <Loader2 className="w-3.5 h-3.5 text-magenta animate-spin" />,
        badge: "bg-magenta/10 text-magenta border-magenta/20",
        label: status.charAt(0).toUpperCase() + status.slice(1),
      };
  }
}

function extractRepoName(url: string): string {
  const match = url.match(/github\.com\/[\w.-]+\/([\w.-]+)/);
  return match?.[1] ?? url;
}

function extractRepoOwner(url: string): string {
  const match = url.match(/github\.com\/([\w.-]+)\//);
  return match?.[1] ?? "";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AuditHistory({ audits }: AuditHistoryProps) {
  return (
    <div>
      <h2 className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-magenta/80 mb-6">Audit History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {audits.map((audit) => {
          const status = getStatusConfig(audit.status);
          const repoName = extractRepoName(audit.repo_url);
          const repoOwner = extractRepoOwner(audit.repo_url);

          return (
            <div key={audit.id} className="rpg-panel p-6 bg-indigo-950/20 hover:border-magenta/40 transition-all group flex flex-col h-full">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="min-w-0">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-tight truncate text-foreground group-hover:text-magenta transition-colors">
                    {repoName}
                  </h3>
                  {repoOwner && (
                    <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-1 flex items-center gap-1.5">
                      <span className="size-1 bg-indigo-900 rotate-45" />
                      {repoOwner}
                    </p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest shrink-0 ${status.badge}`}
                >
                  {status.icon}
                  {status.label}
                </span>
              </div>

              <div className="mt-auto pt-4 border-t border-indigo-900/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {audit.overall_score !== null && (
                    <div className="flex items-center gap-2">
                      <ScoreGauge score={audit.overall_score} size="sm" />
                    </div>
                  )}
                  {audit.overall_score === null && (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      {formatDate(audit.created_at)}
                    </span>
                  )}
                </div>

                <Link
                  href={`/audit/${audit.id}`}
                  className="font-mono text-[10px] uppercase tracking-widest text-magenta hover:text-white transition-colors flex items-center gap-1.5"
                >
                  View <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
