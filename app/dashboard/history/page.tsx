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
  if (score >= 60) return "text-warning";
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
        dot: "bg-indigo-500",
      };
    default:
      return {
        icon: <Loader2 className="w-3.5 h-3.5 text-magenta animate-spin" />,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        dot: "bg-magenta",
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
      <div className="mb-8 pb-6 border-b border-indigo-900/30">
        <h1 className="text-2xl font-mono font-bold uppercase tracking-tight text-foreground glow-text-magenta">Audit History</h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
          All your audits in chronological order
        </p>
      </div>

      {(audits ?? []).length > 0 ? (
        <div className="space-y-10">
          {Array.from(groupedAudits.entries()).map(([date, dateAudits]) => (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-magenta/80">
                  {date}
                </h3>
                <div className="flex-1 h-px bg-indigo-900/30" />
              </div>

              {/* Timeline entries */}
              <div className="space-y-4 pl-4 border-l border-indigo-900/30">
                {(dateAudits as Audit[]).map((audit) => {
                  const status = getStatusConfig(audit.status);
                  return (
                    <div
                      key={audit.id}
                      className="relative pl-6"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-0 top-6 -translate-x-[calc(50%+1px)] size-2 ${status.dot} shadow-[0_0_8px_currentColor]`} />

                      <div className="rpg-panel p-5 flex items-center justify-between gap-4 bg-indigo-950/20 hover:border-magenta/40 transition-all">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="shrink-0 p-2 border border-indigo-900 bg-indigo-950">
                            {status.icon}
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono text-sm font-bold uppercase tracking-tight truncate block group-hover:text-magenta transition-colors">
                              {extractRepoName(audit.repo_url)}
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mt-1">
                              {formatTime(audit.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <span
                            className={`font-mono text-lg font-bold tracking-tighter ${getScoreColor(
                              audit.overall_score
                            )}`}
                          >
                            {audit.overall_score !== null
                              ? `${audit.overall_score}/100`
                              : "—"}
                          </span>
                          <Link
                            href={`/audit/${audit.id}`}
                            className="font-mono text-[10px] uppercase tracking-widest text-magenta hover:text-white transition-colors flex items-center gap-1.5"
                          >
                            View <ExternalLink className="w-3 h-3" />
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
        <div className="text-center py-20 rpg-panel bg-indigo-950/10 border-indigo-900/50 flex flex-col items-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-8">
            No audits yet. Run your first audit to see history here.
          </p>
          <Link
            href="/audit"
            className="rpg-button rpg-button-primary inline-flex items-center gap-2 px-8 py-3 text-xs"
          >
            Start Your First Audit
          </Link>
        </div>
      )}
    </div>
  );
}
