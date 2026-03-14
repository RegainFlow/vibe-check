"use client";

import { AlertTriangle, ShieldX, Info, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ScoreGauge from "@/components/audit/ScoreGauge";
import { scaleIn, fadeUp, staggerContainer } from "@/lib/motion";

const categoryScores = [
  { label: "Security", score: 38 },
  { label: "Error Handling", score: 52 },
  { label: "Structure", score: 71 },
  { label: "Dependencies", score: 85 },
];

const findings = [
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

const severityConfig = {
  critical: {
    icon: ShieldX,
    label: "Critical",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    leftBorder: "border-l-red-500/50",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    leftBorder: "border-l-amber-500/50",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  info: {
    icon: Info,
    label: "Info",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    leftBorder: "border-l-blue-500/50",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
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
      className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
    >
      <Copy className="size-3" />
      Copy Fix Prompt
    </button>
  );
}

export default function SampleReport() {
  return (
    <section className="py-24 px-4 section-glow">
      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            See a sample report
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Here is what your audit looks like. Every finding includes a fix prompt
            you can paste straight into your AI coding tool.
          </p>
        </motion.div>

        {/* Terminal-style report container */}
        <motion.div
          className="terminal-card"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-muted-foreground font-mono">audit-report.json</span>
          </div>

          {/* Report header */}
          <div className="border-b border-white/5 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Overall score with shimmer */}
              <div className="shrink-0 relative">
                <div className="absolute inset-0 rounded-full blur-[30px] opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)" }} />
                <ScoreGauge score={64} label="Overall Score" size="lg" />
              </div>

              {/* Category scores */}
              <div className="flex-1 w-full">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-4">
                  Category Breakdown
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categoryScores.map((cat) => (
                    <div
                      key={cat.label}
                      className="flex flex-col items-center gap-2 rounded-lg border border-white/5 bg-background/30 backdrop-blur-sm p-3"
                    >
                      <ScoreGauge score={cat.score} size="sm" />
                      <span className="text-xs text-muted-foreground font-medium">
                        {cat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Findings */}
          <div className="p-6 md:p-8">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-4">
              Key Findings
            </p>
            <motion.div
              className="flex flex-col gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {findings.map((finding) => {
                const config = severityConfig[finding.severity];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={finding.title}
                    variants={fadeUp}
                    className={`rounded-lg border ${config.border} border-l-4 ${config.leftBorder} ${config.bg} p-5`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          <Icon className={`size-4 shrink-0 ${config.color}`} />
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.badge}`}
                          >
                            {config.label}
                          </span>
                          <h4 className="text-sm font-semibold text-foreground">
                            {finding.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-[26px]">
                        {finding.description}
                      </p>
                      <div className="pl-[26px]">
                        <CopyFixButton prompt={finding.fixPrompt} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            <p className="mt-4 text-center text-xs text-muted-foreground/60">
              Showing 3 of 15+ findings from this sample audit. Full reports include every finding with copy-paste fix prompts.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
