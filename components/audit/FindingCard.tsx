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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, type Severity } from "@/lib/constants";
import type { Finding } from "@/types/audit";

interface FindingCardProps {
  finding: Finding;
}

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

export function FindingCard({ finding }: FindingCardProps) {
  const [expanded, setExpanded] = useState(false);

  const config = severityConfig[finding.severity];
  const SeverityIcon = config.icon;

  async function handleCopyFixPrompt() {
    await navigator.clipboard.writeText(finding.fix_prompt);
    toast.success("Fix prompt copied!");
  }

  return (
    <div className={`rpg-panel border-2 ${config.border} bg-indigo-950/20 overflow-hidden animate-card-enter`}>
      {/* Header */}
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 mt-0.5 p-2 bg-indigo-950 border ${config.border}`}>
            <SeverityIcon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span
                className={`font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${config.bg} ${config.color} ${config.border}`}
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

        {/* File info */}
        {finding.file_path && (
          <div className="flex items-center gap-2 mt-4 ml-12 text-xs text-muted-foreground bg-indigo-950/40 p-2 border border-indigo-900/30">
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
          className="flex items-center gap-2 ml-12 mt-4 font-mono text-[10px] uppercase tracking-widest text-magenta hover:text-white transition-colors"
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
                  <pre className="font-mono text-[11px] bg-indigo-950 border border-indigo-900 p-4 overflow-x-auto break-all text-muted-foreground shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
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
                      className="rpg-button px-3 py-1.5 text-[9px] flex items-center gap-2"
                    >
                      <Copy className="w-3 h-3" />
                      COPY PROMPT
                    </button>
                  </div>
                  <div className="font-mono text-[11px] leading-relaxed text-foreground break-words bg-magenta/5 border border-magenta/20 p-4">
                    {finding.fix_prompt}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
