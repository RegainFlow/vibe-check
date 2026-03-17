export type ContextLoad = "low" | "medium" | "high";
export type AIFixEffort = "low" | "medium" | "high";
export type EstimatedAgentPasses = "single-prompt" | "multi-step" | "large-refactor";
export type LikelyFilesTouched = "small" | "medium" | "large";

export interface FindingObservability {
  contextLoad: ContextLoad;
  aiFixEffort: AIFixEffort;
  estimatedAgentPasses: EstimatedAgentPasses;
  likelyFilesTouched: LikelyFilesTouched;
  bestFitTools: string[];
}

export interface RepoRepairSummary {
  total: number;
  contextLoadCounts: Record<ContextLoad, number>;
  effortCounts: Record<AIFixEffort, number>;
  passesCounts: Record<EstimatedAgentPasses, number>;
  summarySentence: string;
}
