"use client";

import ScoreGauge from "./ScoreGauge";
import { CATEGORY_LABELS, type AnalysisCategory } from "@/lib/constants";
import type { AuditScores } from "@/types/audit";

interface ScoreOverviewProps {
  scores: AuditScores;
}

export default function ScoreOverview({ scores }: ScoreOverviewProps) {
  const categories = Object.entries(scores.categories) as [
    AnalysisCategory,
    { score: number; grade: string; findingCount: number }
  ][];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Category Breakdown</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(([category, data]) => (
          <div
            key={category}
            className="rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm p-5 flex flex-col items-center animate-card-enter"
          >
            <ScoreGauge score={data.score} label={CATEGORY_LABELS[category]} size="sm" />
            <p className="text-xs text-muted-foreground mt-2">
              {data.findingCount} {data.findingCount === 1 ? "finding" : "findings"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
