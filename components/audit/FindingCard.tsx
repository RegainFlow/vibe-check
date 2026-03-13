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
  { icon: typeof AlertTriangle; color: string; bg: string; label: string }
> = {
  critical: {
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    label: "Warning",
  },
  info: {
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
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
    <div className="rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm overflow-hidden animate-card-enter">
      {/* Header */}
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 p-1.5 rounded-md border ${config.bg}`}>
            <SeverityIcon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.bg} ${config.color}`}
              >
                {config.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {CATEGORY_LABELS[finding.category]}
              </span>
            </div>
            <h3 className="font-semibold text-sm md:text-base">
              {finding.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {finding.description}
            </p>
          </div>
        </div>

        {/* File info */}
        {finding.file_path && (
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <FileCode className="w-3.5 h-3.5" />
            <span className="font-mono">
              {finding.file_path}
              {finding.line_start ? `:${finding.line_start}` : ""}
            </span>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 mt-3 transition-colors"
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
          {expanded ? "Show less" : "Show details & fix prompt"}
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
            <div className="border-t border-white/5 p-4 md:p-5 space-y-4 bg-background/30">
              {/* Code snippet */}
              {finding.code_snippet && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Code
                  </p>
                  <pre className="text-xs font-mono bg-background/50 rounded-lg p-3 overflow-x-auto border border-white/5">
                    <code>{finding.code_snippet}</code>
                  </pre>
                </div>
              )}

              {/* Fix prompt */}
              {finding.fix_prompt && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Fix Prompt (paste into Cursor or Claude)
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyFixPrompt}
                      className="h-7 text-xs"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy Fix Prompt
                    </Button>
                  </div>
                  <div className="text-sm bg-primary/5 border border-primary/10 rounded-lg p-3">
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
