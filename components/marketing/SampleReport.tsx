"use client";

import { AlertTriangle, ShieldX, Info, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ScoreGauge from "@/components/audit/ScoreGauge";
import ScoreOverview from "@/components/audit/ScoreOverview";
import FindingsList from "@/components/audit/FindingsList";
import { fadeUp } from "@/lib/motion";
import type { SampleReportData } from "@/lib/sample-report";

// --- Hardcoded fallback (original data) ---

const fallbackCategoryScores = [
  { label: "Security", score: 38 },
  { label: "Error Handling", score: 52 },
  { label: "Structure", score: 71 },
  { label: "Dependencies", score: 85 },
];

const fallbackFindings = [
  {
    severity: "critical" as const,
    title: "SQL injection via unsanitized user input",
    description:
      "The /api/users endpoint passes req.query.id directly into a raw SQL query without parameterization or escaping.",
    fixPrompt:
      "Refactor the /api/users endpoint to use parameterized queries instead of string concatenation for the SQL query. Use the $1 placeholder syntax with the query parameters array.",
  },
  {
    severity: "warning" as const,
    title: "No rate limiting on authentication endpoints",
    description:
      "The /api/auth/login and /api/auth/register routes have no rate limiting, leaving them vulnerable to brute-force attacks.",
    fixPrompt:
      "Add rate limiting middleware to the /api/auth/login and /api/auth/register endpoints. Limit to 5 requests per minute per IP address using an in-memory store or Redis.",
  },
  {
    severity: "info" as const,
    title: "Console.log statements left in production code",
    description:
      "Found 23 console.log statements across 8 files that should be removed or replaced with a proper logging library.",
    fixPrompt:
      "Remove all console.log statements from production code and replace critical logging with a structured logger like Pino or Winston. Keep only error-level logging in API routes.",
  },
];

const fallbackSeverityConfig = {
  critical: {
    icon: ShieldX,
    label: "FATAL",
    color: "text-red-400",
    border: "border-red-500/20",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  warning: {
    icon: AlertTriangle,
    label: "WOUND",
    color: "text-amber-400",
    border: "border-amber-500/20",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  info: {
    icon: Info,
    label: "MINOR",
    color: "text-blue-400",
    border: "border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
};

function CopyFixButton({ prompt }: { prompt: string }) {
  function handleCopy() {
    navigator.clipboard.writeText(prompt);
    toast.success("Fix prompt copied!");
  }

  return (
    <button
      onClick={handleCopy}
      className="rpg-button text-[9px] py-1 px-3 h-auto lowercase"
    >
      <div className="flex items-center gap-2">
        <Copy className="size-3" />
        copy fix prompt
      </div>
    </button>
  );
}

// --- Fallback report (original hardcoded UI) ---

function FallbackReport() {
  return (
    <div className="p-8 md:p-12 bg-indigo-950/10">
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16 pb-12 border-b border-indigo-900/30">
        <div className="shrink-0 flex flex-col items-center gap-4">
          <div className="relative size-32 flex items-center justify-center bg-indigo-950 border-4 border-indigo-900 rounded-full group">
            <div className="absolute inset-0 rounded-full border border-warning animate-pulse group-hover:border-warning group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all" />
            <span className="stat-value text-5xl text-warning">64</span>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-warning/80">Overall Score</span>
        </div>

        <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-6">
          {fallbackCategoryScores.map((cat) => {
            let colorClass = "text-green-400";
            let borderClass = "border-green-400/20";
            if (cat.score < 60) {
              colorClass = "text-red-400";
              borderClass = "border-red-400/20";
            } else if (cat.score < 80) {
              colorClass = "text-warning";
              borderClass = "border-warning/20";
            }

            return (
              <div key={cat.label} className={`rpg-panel p-4 flex flex-col items-center gap-2 bg-indigo-950/40 ${borderClass}`}>
                <span className={`stat-value text-2xl ${colorClass}`}>{cat.score}</span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground text-center">{cat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-magenta/80">Key Findings</h3>
          <div className="h-px flex-1 bg-indigo-900/30" />
        </div>

        <div className="grid gap-6">
          {fallbackFindings.map((finding) => {
            const config = fallbackSeverityConfig[finding.severity];
            const Icon = config.icon;
            return (
              <div
                key={finding.title}
                className={`rpg-panel border-2 ${config.border} bg-indigo-950/10 p-6 group transition-all hover:-translate-y-1`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className={`p-2 bg-indigo-950 border rounded-lg ${config.border}`}>
                      <Icon className={`size-4 ${config.color}`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`font-mono text-[9px] font-bold tracking-[0.2em] ${config.color}`}>
                        [ {config.label} ]
                      </span>
                      <h4 className="font-mono text-sm font-bold text-foreground uppercase tracking-tight">
                        {finding.title}
                      </h4>
                    </div>
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground leading-relaxed pl-0 ml-0 sm:pl-12 sm:border-l sm:border-indigo-900/30 sm:ml-3">
                    {finding.description}
                  </p>
                  <div className="sm:pl-12 sm:ml-3">
                    <CopyFixButton prompt={finding.fixPrompt} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
        Showing 3 of 15+ findings from this sample audit.
      </p>
    </div>
  );
}

// --- Real data report ---

function RealReport({ data }: { data: SampleReportData }) {
  return (
    <div className="p-8 md:p-12 bg-indigo-950/10">
      {/* Score header */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16 pb-12 border-b border-indigo-900/30">
        <div className="shrink-0">
          <ScoreGauge score={data.scores.overall} label="Overall Score" size="lg" />
        </div>
        <div className="flex-1 w-full">
          <ScoreOverview scores={data.scores} />
        </div>
      </div>

      {/* Findings */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-magenta/80">Key Findings</h3>
          <div className="h-px flex-1 bg-indigo-900/30" />
        </div>
        <FindingsList findings={data.findings} />
      </div>
    </div>
  );
}

// --- Main component ---

interface SampleReportProps {
  data: SampleReportData | null;
}

export default function SampleReport({ data }: SampleReportProps) {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 rpg-grid opacity-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="inline-flex items-center gap-3 mb-4 text-center">
            <div className="h-px w-8 bg-magenta/30" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-magenta">The Output</span>
            <div className="h-px w-8 bg-magenta/30" />
          </div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tighter text-foreground uppercase glow-text-magenta">
            See a sample report
          </h2>
          <p className="mt-6 font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground max-w-2xl mx-auto">
            Here is what your audit looks like. Every finding includes a fix prompt
            you can paste straight into your AI coding tool.
          </p>
        </motion.div>

        {/* RPG Panel Report */}
        <div className="terminal-frame max-w-5xl mx-auto">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-red-500/70" />
              <div className="size-2.5 rounded-full bg-yellow-500/70" />
              <div className="size-2.5 rounded-full bg-green-500/70" />
              <span className="ml-2">audit-report.json</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[10px] opacity-50">STABLE</span>
              <div className="size-2 bg-magenta/40 rotate-45" />
            </div>
          </div>

          {data ? <RealReport data={data} /> : <FallbackReport />}
        </div>
      </div>
    </section>
  );
}
