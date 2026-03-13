import { createClient } from "@/lib/supabase/server";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { Audit } from "@/types/audit";

function extractRepoName(url: string): string {
  const match = url.match(/github\.com\/[\w.-]+\/([\w.-]+)/);
  return match?.[1] ?? url;
}

function getScoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

function getStatusConfig(status: Audit["status"]) {
  switch (status) {
    case "completed":
      return {
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-success" />,
        label: "Completed",
        dot: "bg-green-500",
      };
    case "failed":
      return {
        icon: <XCircle className="w-3.5 h-3.5 text-destructive" />,
        label: "Failed",
        dot: "bg-red-500",
      };
    case "pending":
      return {
        icon: <Clock className="w-3.5 h-3.5 text-muted-foreground" />,
        label: "Pending",
        dot: "bg-gray-500",
      };
    default:
      return {
        icon: <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        dot: "bg-primary",
      };
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: audits } = await supabase
    .from("audits")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  // Group audits by date
  const groupedAudits = new Map<string, typeof audits>();
  for (const audit of (audits ?? []) as Audit[]) {
    const dateKey = formatDate(audit.created_at);
    if (!groupedAudits.has(dateKey)) {
      groupedAudits.set(dateKey, []);
    }
    groupedAudits.get(dateKey)!.push(audit);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Audit History</h1>
        <p className="text-muted-foreground text-sm mt-1">
          All your audits in chronological order
        </p>
      </div>

      {(audits ?? []).length > 0 ? (
        <div className="space-y-8">
          {Array.from(groupedAudits.entries()).map(([date, dateAudits]) => (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {date}
                </h3>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Timeline entries */}
              <div className="space-y-3 pl-4 border-l border-white/5">
                {(dateAudits as Audit[]).map((audit) => {
                  const status = getStatusConfig(audit.status);
                  return (
                    <div
                      key={audit.id}
                      className="relative pl-6"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-0 top-3 -translate-x-[calc(50%+1px)] w-2 h-2 rounded-full ${status.dot}`} />

                      <div className="glow-card p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          {status.icon}
                          <div className="min-w-0">
                            <span className="font-medium text-sm font-mono truncate block">
                              {extractRepoName(audit.repo_url)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(audit.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span
                            className={`text-sm font-bold ${getScoreColor(
                              audit.overall_score
                            )}`}
                          >
                            {audit.overall_score !== null
                              ? `${audit.overall_score}/100`
                              : "—"}
                          </span>
                          <Link
                            href={`/audit/${audit.id}`}
                            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            View <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glow-card">
          <p className="text-muted-foreground mb-4">
            No audits yet. Run your first audit to see history here.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start Your First Audit
          </Link>
        </div>
      )}
    </div>
  );
}
