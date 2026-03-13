import type { RawFinding, CategoryScore } from "@/lib/analysis/types";
import {
  CATEGORY_WEIGHTS,
  SEVERITY_DEDUCTIONS,
  GRADE_THRESHOLDS,
  type AnalysisCategory,
  type Grade,
} from "@/lib/constants";

/**
 * Get letter grade for a numeric score.
 */
export function getGrade(score: number): Grade {
  for (const threshold of GRADE_THRESHOLDS) {
    if (score >= threshold.min) {
      return threshold.grade;
    }
  }
  return "F";
}

/**
 * Calculate a category score by starting at 100 and subtracting
 * deductions based on finding severity. Caps at a minimum of 0.
 */
export function calculateCategoryScore(
  findings: RawFinding[],
  category: AnalysisCategory
): CategoryScore {
  const categoryFindings = findings.filter((f) => f.category === category);

  let score = 100;
  for (const finding of categoryFindings) {
    score -= SEVERITY_DEDUCTIONS[finding.severity];
  }

  score = Math.max(0, score);

  return {
    score,
    grade: getGrade(score),
    findingCount: categoryFindings.length,
  };
}

/**
 * Calculate the overall weighted score from individual category scores.
 */
export function calculateOverallScore(
  categoryScores: Record<AnalysisCategory, CategoryScore>
): { score: number; grade: Grade } {
  let weightedSum = 0;

  for (const [category, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    const catScore = categoryScores[category as AnalysisCategory];
    weightedSum += catScore.score * weight;
  }

  const score = Math.round(weightedSum * 100) / 100;

  return {
    score,
    grade: getGrade(score),
  };
}
