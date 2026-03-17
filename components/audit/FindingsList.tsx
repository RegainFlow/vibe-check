"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FindingCard } from "./FindingCard";
import {
  ANALYSIS_CATEGORIES,
  CATEGORY_LABELS,
  type AnalysisCategory,
} from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { Finding } from "@/types/audit";
import type { RecommendedSkill } from "@/types/skills";
import { deriveFindingObservability } from "@/lib/analysis/observability";

interface FindingsListProps {
  findings: Finding[];
}

const severityOrder = { critical: 0, warning: 1, info: 2 };

export default function FindingsList({ findings }: FindingsListProps) {
  const [activeCategory, setActiveCategory] = useState<
    "all" | AnalysisCategory
  >("all");
  const [skillsByCategory, setSkillsByCategory] = useState<
    Partial<Record<AnalysisCategory, RecommendedSkill | null>>
  >({});

  useEffect(() => {
    const categories = [...new Set(findings.map((f) => f.category))];

    categories.forEach(async (category) => {
      try {
        const res = await fetch(`/api/skills/${category}`);
        if (!res.ok) return;
        const data = await res.json();
        setSkillsByCategory((prev) => ({
          ...prev,
          [category]: data.primary ?? null,
        }));
      } catch {
        // Skill recommendations are non-critical — fail silently
      }
    });
  }, [findings]);

  const filteredFindings =
    activeCategory === "all"
      ? findings
      : findings.filter((f) => f.category === activeCategory);

  const sortedFindings = [...filteredFindings].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  const categoriesWithCounts = ANALYSIS_CATEGORIES.map((cat) => ({
    key: cat,
    label: CATEGORY_LABELS[cat],
    count: findings.filter((f) => f.category === cat).length,
  })).filter((c) => c.count > 0);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          onClick={() => setActiveCategory("all")}
          className={`relative px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border rounded-lg cursor-pointer ${
            activeCategory === "all"
              ? "border-magenta/50 bg-magenta/10 text-magenta shadow-[0_0_10px_rgba(217,70,239,0.2)]"
              : "border-indigo-900/50 bg-indigo-950/30 text-muted-foreground hover:border-magenta/30 hover:text-foreground"
          }`}
        >
          {activeCategory === "all" && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-magenta" />
          )}
          <span className="relative z-10">All ({findings.length})</span>
        </button>
        {categoriesWithCounts.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`relative px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border rounded-lg cursor-pointer ${
              activeCategory === cat.key
                ? "border-magenta/50 bg-magenta/10 text-magenta shadow-[0_0_10px_rgba(217,70,239,0.2)]"
                : "border-indigo-900/50 bg-indigo-950/30 text-muted-foreground hover:border-magenta/30 hover:text-foreground"
            }`}
          >
            {activeCategory === cat.key && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-magenta" />
            )}
            <span className="relative z-10">
              {cat.label} ({cat.count})
            </span>
          </button>
        ))}
      </div>

      {/* Findings list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="space-y-4"
        >
          {sortedFindings.length === 0 ? (
            <motion.div
              variants={fadeUp}
              className="text-center py-12 rpg-panel bg-indigo-950/20 border-indigo-900/50"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                No findings in this category.
              </p>
            </motion.div>
          ) : (
            sortedFindings.map((finding) => (
              <motion.div key={finding.id} variants={fadeUp}>
                <FindingCard finding={finding} recommendedSkill={skillsByCategory[finding.category]} observability={deriveFindingObservability(finding)} />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
