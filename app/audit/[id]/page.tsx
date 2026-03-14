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
      <main className="pt-28 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Progress view */}
          {(isRunning || (!audit && !error)) && (
            <div className="max-w-lg mx-auto">
              <h1 className="text-2xl font-bold text-center mb-2">
                Analyzing your code...
              </h1>
              <p className="text-muted-foreground text-center mb-10">
                This usually takes 30-60 seconds
              </p>

              <div className="relative space-y-4">
                {/* Animated gradient background */}
                <div className="absolute -inset-4 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-2xl pointer-events-none" />

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
                      className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        isActive
                          ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                          : isComplete
                          ? "border-success/20 bg-success/5"
                          : "border-white/5 bg-card/30"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive
                            ? "gradient-purple text-white"
                            : isComplete
                            ? "bg-success/20 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isActive ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isComplete ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`font-medium ${
                          isActive
                            ? "text-foreground"
                            : isComplete
                            ? "text-success"
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
            <div className="max-w-lg mx-auto text-center">
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Audit Failed</h1>
              <p className="text-muted-foreground mb-6">
                {audit.error_message || "Something went wrong during analysis."}
              </p>
              <Button onClick={handleRescan} className="gradient-purple border-0 text-white hover:opacity-90">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {/* Results view */}
          {audit?.status === "completed" && audit.scores && (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-1">Audit Results</h1>
                  <p className="text-muted-foreground text-sm">
                    {audit.metadata?.repoOwner}/{audit.metadata?.repoName} &middot;{" "}
                    {audit.total_files} files analyzed
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    {copied ? "Copied!" : "Share Report"}
                  </Button>
                  <Button variant="outline" onClick={handleRescan}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Re-scan
                  </Button>
                </div>
              </div>

              {/* Overall Score with confetti-like burst */}
              <div className="relative flex flex-col items-center mb-12 p-8 rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm overflow-hidden">
                {/* Confetti burst effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 rounded-full opacity-0" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 60%)", animation: "confetti-burst 2s ease-out 1.5s both" }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 rounded-full opacity-0" style={{ background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 60%)", animation: "confetti-burst 2s ease-out 1.8s both" }} />
                </div>

                <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
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

              {/* Findings */}
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-6">Findings</h2>
                <FindingsList findings={findings} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
