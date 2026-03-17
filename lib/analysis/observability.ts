import type { Finding } from "@/types/audit";
import type { AnalysisCategory, Severity } from "@/lib/constants";
import type {
  ContextLoad,
  AIFixEffort,
  FindingObservability,
  RepoRepairSummary,
} from "@/types/observability";

const CONTEXT_LOAD_TABLE: Record<AnalysisCategory, Record<Severity, ContextLoad>> = {
  security:              { critical: "medium", warning: "low",    info: "low" },
  "error-handling":      { critical: "medium", warning: "low",    info: "low" },
  maintainability:       { critical: "medium", warning: "medium", info: "low" },
  "tech-debt":           { critical: "medium", warning: "medium", info: "low" },
  architecture:          { critical: "high",   warning: "high",   info: "medium" },
  scalability:           { critical: "high",   warning: "high",   info: "medium" },
  "prompt-architecture": { critical: "high",   warning: "medium", info: "medium" },
};

const FILES_TOUCHED_TABLE: Record<AnalysisCategory, Record<"default" | "critical", "small" | "medium" | "large">> = {
  security:              { default: "small",  critical: "medium" },
  "error-handling":      { default: "small",  critical: "medium" },
  maintainability:       { default: "small",  critical: "medium" },
  "tech-debt":           { default: "medium", critical: "large" },
  "prompt-architecture": { default: "medium", critical: "large" },
  architecture:          { default: "medium", critical: "large" },
  scalability:           { default: "medium", critical: "large" },
};

const BEST_FIT_TOOLS: Record<AnalysisCategory, string[]> = {
  security:              ["Claude Code", "Codex"],
  "error-handling":      ["Claude Code", "Codex"],
  maintainability:       ["Claude Code"],
  "tech-debt":           ["Claude Code"],
  architecture:          ["Claude Code"],
  scalability:           ["Claude Code"],
  "prompt-architecture": ["Claude Code"],
};

function bumpUp(level: ContextLoad): AIFixEffort {
  if (level === "low") return "medium";
  return "high";
}

export function deriveFindingObservability(finding: Finding): FindingObservability {
  const contextLoad = CONTEXT_LOAD_TABLE[finding.category][finding.severity];

  // aiFixEffort: same base as contextLoad, bumped if long snippet
  let aiFixEffort: AIFixEffort = contextLoad;
  if (finding.code_snippet && finding.code_snippet.length > 200) {
    aiFixEffort = bumpUp(contextLoad);
  }

  // estimatedAgentPasses: derived from aiFixEffort
  const estimatedAgentPasses =
    aiFixEffort === "low" ? "single-prompt" :
    aiFixEffort === "medium" ? "multi-step" :
    "large-refactor";

  // likelyFilesTouched
  const filesTouchedEntry = FILES_TOUCHED_TABLE[finding.category];
  const likelyFilesTouched =
    finding.severity === "critical" ? filesTouchedEntry.critical : filesTouchedEntry.default;

  const bestFitTools = BEST_FIT_TOOLS[finding.category];

  return {
    contextLoad,
    aiFixEffort,
    estimatedAgentPasses,
    likelyFilesTouched,
    bestFitTools,
  };
}

export function deriveRepoRepairSummary(findings: Finding[]): RepoRepairSummary {
  const contextLoadCounts: RepoRepairSummary["contextLoadCounts"] = { low: 0, medium: 0, high: 0 };
  const effortCounts: RepoRepairSummary["effortCounts"] = { low: 0, medium: 0, high: 0 };
  const passesCounts: RepoRepairSummary["passesCounts"] = { "single-prompt": 0, "multi-step": 0, "large-refactor": 0 };

  for (const finding of findings) {
    const obs = deriveFindingObservability(finding);
    contextLoadCounts[obs.contextLoad]++;
    effortCounts[obs.aiFixEffort]++;
    passesCounts[obs.estimatedAgentPasses]++;
  }

  const total = findings.length;
  const quick = effortCounts.low;
  const deep = effortCounts.high;

  let summarySentence: string;
  if (total === 0) {
    summarySentence = "No issues detected — your repo is ready to ship.";
  } else if (deep === 0 && effortCounts.medium === 0) {
    summarySentence = `All ${total} issue${total === 1 ? " is a" : "s are"} quick AI fix${total === 1 ? "" : "es"} — paste the prompts and go.`;
  } else if (quick === 0 && effortCounts.medium === 0) {
    summarySentence = `All ${total} issue${total === 1 ? "" : "s"} require${total === 1 ? "s" : ""} deeper AI-assisted refactoring.`;
  } else {
    const quickAndMod = quick + effortCounts.medium;
    const deepCount = deep;
    summarySentence = `${quickAndMod} quick fix${quickAndMod === 1 ? "" : "es"}, ${deepCount} deeper repair${deepCount === 1 ? "" : "s"} — most can be resolved in scoped AI sessions.`;
  }

  return { total, contextLoadCounts, effortCounts, passesCounts, summarySentence };
}
