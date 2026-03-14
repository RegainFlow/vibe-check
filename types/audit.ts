import type { AnalysisCategory, Grade, Severity } from "@/lib/constants";

export type AuditStatus =
  | "pending"
  | "cloning"
  | "analyzing"
  | "generating"
  | "completed"
  | "failed";

export interface AuditScores {
  overall: number;
  grade: Grade;
  categories: Record<
    AnalysisCategory,
    {
      score: number;
      grade: Grade;
      findingCount: number;
    }
  >;
}

export interface AuditMetadata {
  repoName?: string;
  repoOwner?: string;
  branch?: string;
  totalFiles: number;
  totalLines: number;
  languages: Record<string, number>;
  analyzedAt: string;
}

export interface Audit {
  id: string;
  user_id: string | null;
  repo_url: string;
  status: AuditStatus;
  overall_score: number | null;
  scores: AuditScores | null;
  metadata: AuditMetadata | null;
  share_token: string | null;
  total_files: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Finding {
  id: string;
  audit_id: string;
  category: AnalysisCategory;
  severity: Severity;
  title: string;
  description: string;
  file_path: string;
  line_start: number | null;
  code_snippet: string | null;
  fix_prompt: string;
  deduction: number;
}
