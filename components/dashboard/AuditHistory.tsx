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
        icon: <CheckCircle2 className="w-4 h-4 text-success" />,
        badge: "bg-green-500/10 text-green-400 border-green-500/20",
        label: "Completed",
      };
    case "failed":
      return {
        icon: <XCircle className="w-4 h-4 text-destructive" />,
        badge: "bg-red-500/10 text-red-400 border-red-500/20",
        label: "Failed",
      };
    case "pending":
      return {
        icon: <Clock className="w-4 h-4 text-muted-foreground" />,
        badge: "bg-white/5 text-muted-foreground border-white/10",
        label: "Pending",
      };
    default:
      return {
        icon: <Loader2 className="w-4 h-4 text-primary animate-spin" />,
        badge: "bg-primary/10 text-primary border-primary/20",
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
      <h2 className="text-lg font-semibold mb-4">Audit History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {audits.map((audit) => {
          const status = getStatusConfig(audit.status);
          const repoName = extractRepoName(audit.repo_url);
          const repoOwner = extractRepoOwner(audit.repo_url);

          return (
            <div key={audit.id} className="glow-card p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <h3 className="font-semibold font-mono text-sm truncate">
                    {repoName}
                  </h3>
                  {repoOwner && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {repoOwner}
                    </p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium shrink-0 ${status.badge}`}
                >
                  {status.icon}
                  {status.label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {audit.overall_score !== null && (
                    <ScoreGauge score={audit.overall_score} size="sm" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDate(audit.created_at)}
                  </span>
                </div>

                <Link
                  href={`/audit/${audit.id}`}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
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
