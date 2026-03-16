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
      <h2 className="font-mono text-lg font-bold uppercase tracking-[0.2em] text-foreground mb-6">Category Breakdown</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(([category, data]) => {
          let borderClass = "border-green-400/20";
          if (data.score < 60) borderClass = "border-red-400/20";
          else if (data.score < 80) borderClass = "border-warning/20";

          return (
            <div
              key={category}
              className={`rpg-panel p-5 flex flex-col items-center animate-card-enter bg-indigo-950/20 ${borderClass}`}
            >
              <ScoreGauge score={data.score} label={CATEGORY_LABELS[category]} size="sm" />
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-4">
                {data.findingCount} {data.findingCount === 1 ? "finding" : "findings"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
