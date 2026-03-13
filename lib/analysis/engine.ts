import type { FileEntry, RawFinding, ProcessedFinding, AnalysisResult, CategoryScore } from "@/lib/analysis/types";
import { ANALYSIS_CATEGORIES, type AnalysisCategory } from "@/lib/constants";
import { analyzers } from "@/lib/analysis/analyzers";
import { calculateCategoryScore, calculateOverallScore } from "@/lib/analysis/scoring";

/**
 * Deduplicate findings by patternId + filePath to avoid
 * reporting the same issue multiple times.
 */
function deduplicateFindings(findings: RawFinding[]): RawFinding[] {
  const seen = new Set<string>();
  const unique: RawFinding[] = [];

  for (const finding of findings) {
    const key = `${finding.patternId}::${finding.filePath}::${finding.lineStart}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(finding);
    }
  }

  return unique;
}

/**
 * Build language statistics from analyzed files.
 */
function buildLanguageStats(files: FileEntry[]): Record<string, number> {
  const languages: Record<string, number> = {};
  const extToLang: Record<string, string> = {
    ".ts": "TypeScript",
    ".tsx": "TypeScript (JSX)",
    ".js": "JavaScript",
    ".jsx": "JavaScript (JSX)",
    ".py": "Python",
    ".rb": "Ruby",
    ".go": "Go",
    ".java": "Java",
    ".php": "PHP",
    ".css": "CSS",
    ".scss": "SCSS",
    ".html": "HTML",
    ".json": "JSON",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".md": "Markdown",
    ".sql": "SQL",
    ".sh": "Shell",
    ".rs": "Rust",
    ".swift": "Swift",
    ".kt": "Kotlin",
    ".c": "C",
    ".cpp": "C++",
    ".h": "C/C++ Header",
  };

  for (const file of files) {
    const lang = extToLang[file.extension] || file.extension || "Other";
    languages[lang] = (languages[lang] || 0) + 1;
  }

  return languages;
}

/**
 * Run all 7 analyzers against the provided files, deduplicate findings,
 * calculate scores, and return the full AnalysisResult.
 *
 * Note: The GPT rewriter is NOT called here. That step happens separately
 * (e.g., in the Inngest function) to keep the engine synchronous and testable.
 * Findings are returned as ProcessedFinding[] with placeholder description/fixPrompt
 * that should be overwritten by the rewriter.
 */
export async function analyzeCodebase(
  files: FileEntry[]
): Promise<AnalysisResult> {
  // Run all analyzers concurrently using Promise.allSettled
  const results = await Promise.allSettled(
    analyzers.map((analyzer) =>
      Promise.resolve(analyzer.analyze(files))
    )
  );

  // Collect all findings from successful analyzers
  const allFindings: RawFinding[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allFindings.push(...result.value);
    }
    // Failed analyzers are silently skipped — the others still produce results
  }

  // Deduplicate
  const uniqueFindings = deduplicateFindings(allFindings);

  // Calculate category scores
  const categoryScores = {} as Record<AnalysisCategory, CategoryScore>;
  for (const category of ANALYSIS_CATEGORIES) {
    categoryScores[category] = calculateCategoryScore(uniqueFindings, category);
  }

  // Calculate overall score
  const { score: overallScore, grade: overallGrade } =
    calculateOverallScore(categoryScores);

  // Convert RawFindings to ProcessedFindings with placeholder descriptions
  // (the rewriter will overwrite these with plain-English versions)
  const processedFindings: ProcessedFinding[] = uniqueFindings.map((finding) => ({
    ...finding,
    description: finding.context || finding.title,
    fixPrompt: `Fix: ${finding.title} in ${finding.filePath}`,
    deduction: 0, // Will be set by rewriter if needed; score is in categoryScores
  }));

  // Build metadata
  const totalLines = files.reduce((sum, f) => sum + f.lineCount, 0);
  const languages = buildLanguageStats(files);

  return {
    overallScore,
    overallGrade,
    categoryScores,
    findings: processedFindings,
    metadata: {
      totalFiles: files.length,
      totalLines,
      languages,
      analyzedAt: new Date().toISOString(),
    },
  };
}
