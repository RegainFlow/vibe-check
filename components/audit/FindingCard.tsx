"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Copy,
  FileCode,
  AlertTriangle,
  AlertCircle,
  Info,
  ExternalLink,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, type Severity } from "@/lib/constants";
import type { Finding } from "@/types/audit";
import type { RecommendedSkill, SkillCompatibility } from "@/types/skills";
import type { FindingObservability } from "@/types/observability";
import {
  buildClaudePrompt,
  buildCodexPrompt,
  buildVibeCheckFallbackPrompt,
} from "@/lib/skills/prompt-builders";

interface FindingCardProps {
  finding: Finding;
  recommendedSkill?: RecommendedSkill | null;
  observability?: FindingObservability;
}

const EFFORT_LABELS = { low: "Quick Fix", medium: "Moderate", high: "Deep Refactor" } as const;
const CONTEXT_LABELS = { low: "Low Context", medium: "Med Context", high: "High Context" } as const;
const PASSES_LABELS = { "single-prompt": "Single-prompt", "multi-step": "Multi-step", "large-refactor": "Large refactor" } as const;
const FILES_LABELS = { small: "1-2 files", medium: "3-5 files", large: "6+ files" } as const;

const EFFORT_BADGE = {
  low: "bg-green-500/10 text-green-400 border-green-500/30",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  high: "bg-red-500/10 text-red-400 border-red-500/30",
} as const;

const CONTEXT_BADGE = {
  low: "bg-cyan/10 text-cyan border-cyan/30",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  high: "bg-magenta/10 text-magenta border-magenta/30",
} as const;

const severityConfig: Record<
  Severity,
  { icon: typeof AlertTriangle; color: string; bg: string; border: string; label: string }
> = {
  critical: {
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    label: "Warning",
  },
  info: {
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    label: "Info",
  },
};

const compatibilityStyles: Record<SkillCompatibility, { bg: string; text: string; border: string; label: string }> = {
  "best-fit": { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", label: "Best Fit" },
  "good-fit": { bg: "bg-cyan/10", text: "text-cyan", border: "border-cyan/30", label: "Good Fit" },
  "possible-fit": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", label: "Possible Fit" },
};

export function FindingCard({ finding, recommendedSkill, observability }: FindingCardProps) {
  const [expanded, setExpanded] = useState(false);

  const config = severityConfig[finding.severity];
  const SeverityIcon = config.icon;

  async function handleCopyFixPrompt() {
    await navigator.clipboard.writeText(finding.fix_prompt);
    toast.success("Fix prompt copied!");
  }

  async function handleCopyClaudePrompt() {
    if (!recommendedSkill) return;
    const prompt = buildClaudePrompt(finding, recommendedSkill.skill);
    await navigator.clipboard.writeText(prompt);
    toast.success("Claude prompt copied!");
  }

  async function handleCopyCodexPrompt() {
    if (!recommendedSkill) return;
    const prompt = buildCodexPrompt(finding, recommendedSkill.skill);
    await navigator.clipboard.writeText(prompt);
    toast.success("Codex prompt copied!");
  }

  async function handleCopyVibeCheckPrompt() {
    const prompt = buildVibeCheckFallbackPrompt(finding);
    await navigator.clipboard.writeText(prompt);
    toast.success("VibeCheck prompt copied!");
  }

  function handleOpenSkillSource() {
    if (!recommendedSkill?.skill.source_skill_url) return;
    window.open(recommendedSkill.skill.source_skill_url, "_blank");
  }

  return (
    <div className={`rpg-panel border-2 ${config.border} bg-indigo-950/20 overflow-hidden animate-card-enter`}>
      {/* Header */}
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 mt-0.5 p-2 bg-indigo-950 border rounded-lg ${config.border}`}>
            <SeverityIcon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span
                className={`font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-md ${config.bg} ${config.color} ${config.border}`}
              >
                [ {config.label} ]
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                {CATEGORY_LABELS[finding.category]}
              </span>
            </div>
            <h3 className="font-mono font-bold text-sm md:text-base text-foreground uppercase tracking-tight">
              {finding.title}
            </h3>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground leading-relaxed mt-2 line-clamp-2">
              {finding.description}
            </p>
          </div>
        </div>

        {/* Observability badges */}
        {observability && (
          <div className="flex items-center justify-between gap-3 mt-3 ml-12 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-md ${EFFORT_BADGE[observability.aiFixEffort]}`}>
                {EFFORT_LABELS[observability.aiFixEffort]}
              </span>
              <span className={`font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-md ${CONTEXT_BADGE[observability.contextLoad]}`}>
                {CONTEXT_LABELS[observability.contextLoad]}
              </span>
            </div>
            <span className="font-mono text-[9px] text-muted-foreground opacity-60">
              {PASSES_LABELS[observability.estimatedAgentPasses]} · {FILES_LABELS[observability.likelyFilesTouched]}
            </span>
          </div>
        )}

        {/* File info */}
        {finding.file_path && (
          <div className="flex items-center gap-2 mt-4 ml-12 text-xs text-muted-foreground bg-indigo-950/40 p-2 border border-indigo-900/30 rounded-lg">
            <FileCode className="w-3.5 h-3.5 text-magenta" />
            <span className="font-mono text-[10px]">
              {finding.file_path}
              {finding.line_start ? <span className="text-magenta">:{finding.line_start}</span> : ""}
            </span>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 ml-12 mt-4 font-mono text-[10px] uppercase tracking-widest text-magenta hover:text-white transition-colors cursor-pointer"
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
          {expanded ? "HIDE DETAILS" : "SHOW DETAILS & FIX PROMPT"}
        </button>
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div className="border-t border-indigo-900/50 p-4 md:p-6 space-y-6 bg-indigo-950/40">
              {/* Code snippet */}
              {finding.code_snippet && (
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-magenta/80 mb-3 flex items-center gap-2">
                    <span className="size-1.5 bg-magenta rotate-45" />
                    Code Segment
                  </p>
                  <pre className="font-mono text-[11px] bg-indigo-950 border border-indigo-900 p-4 overflow-x-auto break-all text-muted-foreground shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] rounded-lg">
                    <code>{finding.code_snippet}</code>
                  </pre>
                </div>
              )}

              {/* Fix prompt */}
              {finding.fix_prompt && (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-magenta/80 flex items-center gap-2">
                      <span className="size-1.5 bg-magenta rotate-45" />
                      Fix Prompt <span className="opacity-50 hidden sm:inline">(Paste into Cursor/Claude)</span>
                    </p>
                    <button
                      onClick={handleCopyFixPrompt}
                      className="rpg-button rpg-button-secondary px-3 py-1.5 text-[9px] flex items-center gap-2"
                    >
                      <Copy className="w-3 h-3" />
                      COPY PROMPT
                    </button>
                  </div>
                  <div className="font-mono text-[11px] leading-relaxed text-foreground break-words bg-magenta/5 border border-magenta/20 p-4 rounded-lg">
                    {finding.fix_prompt}
                  </div>
                </div>
              )}

              {/* Suggested Skill */}
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-magenta/80 mb-3 flex items-center gap-2">
                  <span className="size-1.5 bg-magenta rotate-45" />
                  Suggested Skill
                </p>
                {recommendedSkill ? (
                  <div className="bg-indigo-950/60 border border-indigo-900/50 rounded-lg p-4 space-y-3">
                    {/* Skill header */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Sparkles className="w-3.5 h-3.5 text-magenta shrink-0" />
                      <span className="font-mono text-xs font-bold text-foreground">
                        {recommendedSkill.skill.title}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        by {recommendedSkill.skill.provider}
                      </span>
                      {(() => {
                        const cs = compatibilityStyles[recommendedSkill.compatibility];
                        return (
                          <span className={`font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-md ${cs.bg} ${cs.text} ${cs.border}`}>
                            {cs.label}
                          </span>
                        );
                      })()}
                    </div>

                    {/* Why this fits */}
                    {recommendedSkill.why_this_fits && (
                      <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                        {recommendedSkill.why_this_fits}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleCopyClaudePrompt}
                        className="rpg-button rpg-button-secondary px-3 py-1.5 text-[9px] flex items-center gap-2"
                      >
                        <Copy className="w-3 h-3" />
                        COPY FOR CLAUDE
                      </button>
                      <button
                        onClick={handleCopyCodexPrompt}
                        className="rpg-button rpg-button-secondary px-3 py-1.5 text-[9px] flex items-center gap-2"
                      >
                        <Copy className="w-3 h-3" />
                        COPY FOR CODEX
                      </button>
                      <button
                        onClick={handleOpenSkillSource}
                        className="rpg-button rpg-button-secondary px-3 py-1.5 text-[9px] flex items-center gap-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        OPEN SKILL SOURCE
                      </button>
                      <button
                        onClick={handleCopyVibeCheckPrompt}
                        className="rpg-button rpg-button-secondary px-3 py-1.5 text-[9px] flex items-center gap-2"
                      >
                        <Wand2 className="w-3 h-3" />
                        VIBECHECK PROMPT
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-950/60 border border-indigo-900/50 rounded-lg p-4 space-y-3">
                    <p className="font-mono text-[11px] text-muted-foreground">
                      No curated skill available for this category yet.
                    </p>
                    <button
                      onClick={handleCopyVibeCheckPrompt}
                      className="rpg-button rpg-button-secondary px-3 py-1.5 text-[9px] flex items-center gap-2"
                    >
                      <Wand2 className="w-3 h-3" />
                      GENERATE VIBECHECK PROMPT
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
