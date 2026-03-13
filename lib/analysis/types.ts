import type { AnalysisCategory, Severity, Grade } from "@/lib/constants";

export interface FileEntry {
  path: string;
  relativePath: string;
  content: string;
  extension: string;
  lineCount: number;
}

export interface RawFinding {
  category: AnalysisCategory;
  severity: Severity;
  patternId: string;
  title: string;
  filePath: string;
  lineStart: number;
  lineEnd?: number;
  codeSnippet?: string;
  context?: string;
}

export interface ProcessedFinding extends RawFinding {
  description: string;
  fixPrompt: string;
  deduction: number;
}

export interface CategoryScore {
  score: number;
  grade: Grade;
  findingCount: number;
}

export interface AnalysisResult {
  overallScore: number;
  overallGrade: Grade;
  categoryScores: Record<AnalysisCategory, CategoryScore>;
  findings: ProcessedFinding[];
  metadata: {
    totalFiles: number;
    totalLines: number;
    languages: Record<string, number>;
    analyzedAt: string;
  };
}

export interface AnalyzerModule {
  name: AnalysisCategory;
  analyze: (files: FileEntry[]) => RawFinding[];
}
