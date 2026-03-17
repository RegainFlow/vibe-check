"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  GitBranch,
  Search,
  Cpu,
  Sparkles,
  CheckCircle2,
  XCircle,
  Share2,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";
import ScoreGauge from "@/components/audit/ScoreGauge";
import ScoreOverview from "@/components/audit/ScoreOverview";
import FindingsList from "@/components/audit/FindingsList";
import { AIRepairSummary } from "@/components/audit/AIRepairSummary";
import type { Audit, Finding } from "@/types/audit";
import type { AuditStatus } from "@/types/audit";

const STEPS = [
  { key: "cloning", label: "Cloning repository", icon: GitBranch },
  { key: "analyzing", label: "Analyzing code", icon: Search },
  { key: "generating", label: "Generating report", icon: Cpu },
  { key: "completed", label: "Audit complete", icon: Sparkles },
] as const;

const STATUS_ORDER: AuditStatus[] = [
  "pending",
  "cloning",
  "analyzing",
  "generating",
  "completed",
];

export default function AuditResultPage() {
  const params = useParams();
  const auditId = params.id as string;
  const [audit, setAudit] = useState<Audit | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async (): Promise<"done" | "reconnect"> => {
    try {
      const res = await fetch(`/api/audit/status/${auditId}`);
      if (!res.ok) throw new Error("Failed to fetch audit");
      const reader = res.body?.getReader();
      if (!reader) return "reconnect";

      const decoder = new TextDecoder();
      let buffer = "";
      let lastAuditStatus = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.audit) {
                setAudit(data.audit);
                setLoading(false);
                lastAuditStatus = data.audit.status;
              }
              if (data.findings) setFindings(data.findings);
              if (data.error) setError(data.error);
            } catch {
              // skip malformed SSE
            }
          }
        }
      }

      // Stream ended — if audit isn't done yet, reconnect
      if (lastAuditStatus && !["completed", "failed"].includes(lastAuditStatus)) {
        return "reconnect";
      }
      return "done";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection lost");
      return "reconnect";
    }
  }, [auditId]);

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      while (!cancelled) {
        const result = await fetchResults();
        if (result === "done" || cancelled) break;
        // Wait briefly before reconnecting
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    connect();
    return () => { cancelled = true; };
  }, [fetchResults]);

  async function handleShare() {
    if (!audit?.share_token) return;
    const url = `${window.location.origin}/report/${audit.share_token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRescan() {
    if (!audit?.repo_url) return;
    window.location.href = `/audit?url=${encodeURIComponent(audit.repo_url)}`;
  }

  const isRunning =
    audit?.status &&
    !["completed", "failed"].includes(audit.status);

  const currentStepIndex = audit?.status
    ? STATUS_ORDER.indexOf(audit.status)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 rpg-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 dungeon-gradient pointer-events-none" />
        <div className="scanline" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Progress view — shown while audit is running OR before first SSE data */}
          {(isRunning || (loading && !audit && !error)) && (
            <div className="max-w-lg mx-auto rpg-panel p-10 bg-indigo-950/20">
              <h1 className="text-2xl font-mono font-bold uppercase tracking-tight text-center mb-2 glow-text-magenta text-foreground">
                Analyzing your code...
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center mb-10">
                This usually takes 30-60 seconds
              </p>

              <div className="space-y-4">
                {STEPS.map((step) => {
                  const stepIndex = STATUS_ORDER.indexOf(
                    step.key as AuditStatus
                  );
                  const isActive = currentStepIndex === stepIndex;
                  const isComplete = currentStepIndex > stepIndex;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={`relative flex items-center gap-4 p-4 transition-all border rounded-lg ${
                        isActive
                          ? "border-magenta/50 bg-magenta/5 shadow-[0_0_15px_rgba(217,70,239,0.2)]"
                          : isComplete
                          ? "border-green-500/20 bg-green-500/5"
                          : "border-indigo-900/30 bg-indigo-950/20"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 border flex items-center justify-center rotate-45 rounded-sm ${
                          isActive
                            ? "border-magenta bg-indigo-950 text-magenta"
                            : isComplete
                            ? "border-green-500 bg-green-950 text-green-400"
                            : "border-indigo-900 bg-indigo-950 text-muted-foreground"
                        }`}
                      >
                        <div className="-rotate-45">
                          {isActive ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : isComplete ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                      <span
                        className={`font-mono text-xs font-bold uppercase tracking-widest ${
                          isActive
                            ? "text-foreground"
                            : isComplete
                            ? "text-green-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error view */}
          {audit?.status === "failed" && (
            <div className="max-w-lg mx-auto text-center rpg-panel p-10 bg-red-950/10 border-red-500/30">
              <div className="w-16 h-16 border-2 border-red-500/50 bg-red-950 flex items-center justify-center rotate-45 rounded-sm mx-auto mb-8">
                <XCircle className="w-8 h-8 text-red-500 -rotate-45" />
              </div>
              <h1 className="text-2xl font-mono font-bold uppercase tracking-tight mb-2 text-red-500">Audit Failed</h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-8">
                {audit.error_message || "Something went wrong during analysis."}
              </p>
              <button onClick={handleRescan} className="rpg-button border-red-900 hover:border-red-500 hover:text-red-400 px-8 py-3 text-xs flex items-center gap-2 mx-auto">
                <RotateCcw className="w-4 h-4" />
                TRY AGAIN
              </button>
            </div>
          )}

          {/* Results view */}
          {audit?.status === "completed" && audit.scores && (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-mono font-bold uppercase tracking-tighter mb-2 text-foreground glow-text-magenta">Audit Results</h1>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <span className="text-magenta">{audit.metadata?.repoOwner}/{audit.metadata?.repoName}</span>
                    <span className="size-1 bg-indigo-900 rotate-45" />
                    {audit.total_files} files analyzed
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleShare} className="rpg-button rpg-button-secondary px-4 py-2 text-[10px] flex items-center gap-2">
                    <Share2 className="w-3.5 h-3.5" />
                    {copied ? "COPIED!" : "SHARE REPORT"}
                  </button>
                  <button onClick={handleRescan} className="rpg-button rpg-button-secondary px-4 py-2 text-[10px] flex items-center gap-2 border-indigo-500/50 hover:border-indigo-400">
                    <RotateCcw className="w-3.5 h-3.5" />
                    RE-SCAN
                  </button>
                </div>
              </div>

              {/* Overall Score */}
              <div className="relative flex flex-col items-center mb-16 p-12 rpg-panel bg-indigo-950/20 overflow-hidden">
                {/* Confetti burst effect via scanning lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 rounded-full opacity-0" style={{ background: "radial-gradient(circle, rgba(217,70,239,0.15) 0%, transparent 60%)", animation: "confetti-burst 2s ease-out 1.5s both" }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 rounded-full opacity-0" style={{ background: "radial-gradient(circle, rgba(253,224,71,0.1) 0%, transparent 60%)", animation: "confetti-burst 2s ease-out 1.8s both" }} />
                </div>

                <p className="font-mono text-xs font-bold uppercase tracking-[0.4em] text-magenta/80 mb-6 text-center">
                  Launch Readiness Score
                </p>
                <ScoreGauge
                  score={audit.scores.overall}
                  label="Overall"
                  size="lg"
                />
              </div>

              {/* Category Scores */}
              <ScoreOverview scores={audit.scores} />

              {/* AI Repair Summary */}
              {findings.length > 0 && (
                <div className="mt-16">
                  <AIRepairSummary findings={findings} />
                </div>
              )}

              {/* Findings */}
              <div className="mt-16">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-mono text-lg font-bold uppercase tracking-[0.2em] text-foreground">Findings & Repairs</h2>
                  <div className="h-px flex-1 bg-indigo-900/30" />
                </div>
                <FindingsList findings={findings} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}