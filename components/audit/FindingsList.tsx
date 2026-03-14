"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FindingCard } from "./FindingCard";
import {
  ANALYSIS_CATEGORIES,
  CATEGORY_LABELS,
  type AnalysisCategory,
} from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { Finding } from "@/types/audit";

interface FindingsListProps {
  findings: Finding[];
}

const severityOrder = { critical: 0, warning: 1, info: 2 };

export default function FindingsList({ findings }: FindingsListProps) {
  const [activeCategory, setActiveCategory] = useState<
    "all" | AnalysisCategory
  >("all");

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
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button
          onClick={() => setActiveCategory("all")}
          className={`relative px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === "all"
              ? "text-primary-foreground"
              : "bg-secondary/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          {activeCategory === "all" && (
            <motion.div
              layoutId="findings-tab-indicator"
              className="absolute inset-0 rounded-lg bg-primary"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <span className="relative z-10">All ({findings.length})</span>
        </button>
        {categoriesWithCounts.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`relative px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.key
                ? "text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeCategory === cat.key && (
              <motion.div
                layoutId="findings-tab-indicator"
                className="absolute inset-0 rounded-lg bg-primary"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
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
          className="space-y-3"
        >
          {sortedFindings.length === 0 ? (
            <motion.div
              variants={fadeUp}
              className="text-center py-12 text-muted-foreground"
            >
              No findings in this category.
            </motion.div>
          ) : (
            sortedFindings.map((finding) => (
              <motion.div key={finding.id} variants={fadeUp}>
                <FindingCard finding={finding} />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
