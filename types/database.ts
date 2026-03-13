import type { AuditMetadata, AuditScores, AuditStatus } from "./audit";
import type { AnalysisCategory, PlanType, Severity } from "@/lib/constants";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          plan: PlanType;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          audits_used_this_month: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          plan?: PlanType;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          audits_used_this_month?: number;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      audits: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          repo_url: string;
          status?: AuditStatus;
          overall_score?: number | null;
          scores?: AuditScores | null;
          metadata?: AuditMetadata | null;
          share_token?: string | null;
          total_files?: number;
          error_message?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["audits"]["Insert"]>;
      };
      findings: {
        Row: {
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
          created_at: string;
        };
        Insert: {
          id?: string;
          audit_id: string;
          category: AnalysisCategory;
          severity: Severity;
          title: string;
          description: string;
          file_path: string;
          line_start?: number | null;
          code_snippet?: string | null;
          fix_prompt: string;
          deduction: number;
        };
        Update: Partial<Database["public"]["Tables"]["findings"]["Insert"]>;
      };
    };
  };
}
