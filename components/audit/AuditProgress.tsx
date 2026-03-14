"use client";

import { Loader2, CheckCircle2, GitBranch, Search, Cpu, Sparkles } from "lucide-react";
import type { AuditStatus } from "@/types/audit";

interface AuditProgressProps {
  status: AuditStatus;
}

const STEPS = [
  { key: "cloning" as const, label: "Cloning repository", icon: GitBranch },
  { key: "analyzing" as const, label: "Analyzing code", icon: Search },
  { key: "generating" as const, label: "Generating report", icon: Cpu },
  { key: "completed" as const, label: "Audit complete", icon: Sparkles },
];

const STATUS_ORDER: AuditStatus[] = [
  "pending",
  "cloning",
  "analyzing",
  "generating",
  "completed",
];

export function AuditProgress({ status }: AuditProgressProps) {
  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className="space-y-4">
      {STEPS.map((step) => {
        const stepIndex = STATUS_ORDER.indexOf(step.key);
        const isActive = currentIndex === stepIndex;
        const isComplete = currentIndex > stepIndex;
        const Icon = step.icon;

        return (
          <div
            key={step.key}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              isActive
                ? "border-primary/50 bg-primary/5"
                : isComplete
                ? "border-success/20 bg-success/5"
                : "border-white/5 bg-card/30"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive
                  ? "bg-primary/20 text-primary"
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
  );
}
