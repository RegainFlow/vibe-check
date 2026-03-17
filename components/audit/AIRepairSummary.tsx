"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { deriveRepoRepairSummary } from "@/lib/analysis/observability";
import type { Finding } from "@/types/audit";

interface AIRepairSummaryProps {
  findings: Finding[];
}

const EFFORT_BADGE_STYLES = {
  low: "bg-green-500/10 text-green-400 border-green-500/30",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  high: "bg-red-500/10 text-red-400 border-red-500/30",
} as const;

const EFFORT_LABELS = { low: "Quick Fix", medium: "Moderate", high: "Deep Refactor" } as const;

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-1.5 flex-1 rounded-full bg-indigo-900/40 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function AIRepairSummary({ findings }: AIRepairSummaryProps) {
  if (findings.length === 0) return null;

  const summary = deriveRepoRepairSummary(findings);
  const maxCtx = Math.max(summary.contextLoadCounts.low, summary.contextLoadCounts.medium, summary.contextLoadCounts.high);
  const maxPasses = Math.max(summary.passesCounts["single-prompt"], summary.passesCounts["multi-step"], summary.passesCounts["large-refactor"]);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <div className="rpg-panel p-6 md:p-8 bg-indigo-950/20">
        {/* Heading */}
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-magenta/80 flex items-center gap-2 mb-4">
          <span className="size-1.5 bg-magenta rotate-45" />
          AI Repair Summary
        </p>

        {/* Summary sentence */}
        <p className="font-mono text-[11px] md:text-xs text-foreground mb-6">
          &ldquo;{summary.summarySentence}&rdquo;
        </p>

        {/* Effort badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["low", "medium", "high"] as const).map((level) => {
            const count = summary.effortCounts[level];
            if (count === 0) return null;
            return (
              <span
                key={level}
                className={`font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-md ${EFFORT_BADGE_STYLES[level]}`}
              >
                {EFFORT_LABELS[level]}: {count}
              </span>
            );
          })}
        </div>

        {/* Bar charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Context Distribution */}
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Context Distribution
            </p>
            <div className="space-y-2">
              {([
                { key: "low" as const, label: "Low Context", color: "bg-green-500" },
                { key: "medium" as const, label: "Med Context", color: "bg-amber-500" },
                { key: "high" as const, label: "High Context", color: "bg-red-500" },
              ]).map(({ key, label, color }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="font-mono text-[9px] text-muted-foreground w-20 shrink-0">{label}</span>
                  <Bar value={summary.contextLoadCounts[key]} max={maxCtx} color={color} />
                  <span className="font-mono text-[9px] text-muted-foreground w-4 text-right">{summary.contextLoadCounts[key]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fix Sessions */}
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Fix Sessions
            </p>
            <div className="space-y-2">
              {([
                { key: "single-prompt" as const, label: "Single-prompt", color: "bg-green-500" },
                { key: "multi-step" as const, label: "Multi-step", color: "bg-amber-500" },
                { key: "large-refactor" as const, label: "Large refactor", color: "bg-red-500" },
              ]).map(({ key, label, color }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="font-mono text-[9px] text-muted-foreground w-24 shrink-0">{label}</span>
                  <Bar value={summary.passesCounts[key]} max={maxPasses} color={color} />
                  <span className="font-mono text-[9px] text-muted-foreground w-4 text-right">{summary.passesCounts[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
