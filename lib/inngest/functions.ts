import os from "os";
import path from "path";
import fs from "fs/promises";
import { inngest } from "./client";
import { createAdminClient } from "@/lib/supabase/admin";
import { cloneRepo } from "@/lib/analysis/ingestion/github";
import { extractZip } from "@/lib/analysis/ingestion/zip";
import { scanFiles } from "@/lib/analysis/scanner";
import { analyzeCodebase } from "@/lib/analysis/engine";
import { rewriteFindings } from "@/lib/openai/rewriter";
import type { AnalysisResult, ProcessedFinding } from "@/lib/analysis/types";
import type { AuditStatus } from "@/types/audit";
import { SEVERITY_DEDUCTIONS, type AnalysisCategory, type Severity } from "@/lib/constants";

const MAX_FINDINGS_PER_CATEGORY = 1;
const SEVERITY_PRIORITY: Record<Severity, number> = {
  critical: SEVERITY_DEDUCTIONS.critical,
  warning: SEVERITY_DEDUCTIONS.warning,
  info: SEVERITY_DEDUCTIONS.info,
};

/**
 * Keep the top N most severe findings per category to limit
 * the number of findings sent to the GPT rewriter.
 * Scores remain accurate because they are computed from ALL findings in the engine.
 */
function capFindings(
  findings: ProcessedFinding[],
  maxPerCategory: number = MAX_FINDINGS_PER_CATEGORY
): ProcessedFinding[] {
  const grouped = new Map<AnalysisCategory, ProcessedFinding[]>();

  for (const f of findings) {
    const list = grouped.get(f.category) ?? [];
    list.push(f);
    grouped.set(f.category, list);
  }

  const capped: ProcessedFinding[] = [];

  for (const [, list] of grouped) {
    list.sort(
      (a, b) =>
        (SEVERITY_PRIORITY[b.severity] ?? 0) -
        (SEVERITY_PRIORITY[a.severity] ?? 0)
    );
    capped.push(...list.slice(0, maxPerCategory));
  }

  return capped;
}

async function updateAuditStatus(
  auditId: string,
  status: AuditStatus,
  extra?: Record<string, unknown>
) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("audits")
    .update({ status, ...extra })
    .eq("id", auditId);
  if (error) throw new Error(`Failed to update audit status: ${error.message}`);
}

export const runAudit = inngest.createFunction(
  {
    id: "run-audit",
    retries: 0,
    onFailure: async ({ event }) => {
      const { auditId } = event.data.event.data as { auditId: string };
      const errorMessage =
        event.data.error?.message ?? "An unexpected error occurred";
      await updateAuditStatus(auditId, "failed", {
        error_message: errorMessage,
      });
    },
  },
  { event: "audit/started" },
  async ({ event, step }) => {
    const { auditId, repoUrl, source, zipStoragePath } = event.data as {
      auditId: string;
      repoUrl: string;
      source: "github" | "zip";
      userId: string | null;
      zipStoragePath?: string;
    };

    const tmpDir = path.join(os.tmpdir(), `vibecheck-${auditId}`);

    try {
      // Step 1: Ingest + Scan + Analyze — all in one step because /tmp
      // doesn't persist between Inngest steps on serverless (each step
      // is a separate function invocation).
      const result: AnalysisResult = await step.run("ingest-scan-analyze", async () => {
        await updateAuditStatus(auditId, "cloning");

        if (source === "zip" && zipStoragePath) {
          const admin = createAdminClient();
          const { data, error } = await admin.storage
            .from("zip-uploads")
            .download(zipStoragePath);
          if (error || !data) throw new Error("Failed to download ZIP from storage");

          const buffer = Buffer.from(await data.arrayBuffer());
          await fs.mkdir(tmpDir, { recursive: true });
          await extractZip(buffer, tmpDir);

          await admin.storage.from("zip-uploads").remove([zipStoragePath]);
        } else {
          await cloneRepo(repoUrl, tmpDir);
        }

        await updateAuditStatus(auditId, "analyzing");
        const files = await scanFiles(tmpDir, 2000);
        const analysisResult = await analyzeCodebase(files);
        return analysisResult;
      });

      // Step 3.5: Cap — keep top 1 finding per category (max 7 total)
      // Scores stay accurate since they were computed from ALL findings in the engine
      const cappedFindings = capFindings(result.findings);

      // Step 4: Rewrite — AI-enhance findings
      const rewrittenFindings = await step.run("rewrite", async () => {
        await updateAuditStatus(auditId, "generating");
        const enhanced = await rewriteFindings(cappedFindings);
        return enhanced;
      });

      // Step 5: Finalize — store results
      await step.run("finalize", async () => {
        const admin = createAdminClient();

        // Update audit with scores and metadata
        const { error: updateError } = await admin
          .from("audits")
          .update({
            status: "completed" as AuditStatus,
            overall_score: Math.round(result.overallScore),
            scores: {
              overall: result.overallScore,
              grade: result.overallGrade,
              categories: result.categoryScores,
            },
            metadata: {
              totalFiles: result.metadata.totalFiles,
              totalLines: result.metadata.totalLines,
              languages: result.metadata.languages,
              analyzedAt: result.metadata.analyzedAt,
            },
            total_files: result.metadata.totalFiles,
          })
          .eq("id", auditId);
        if (updateError) throw new Error(`Failed to finalize audit: ${updateError.message}`);

        // Insert findings
        if (rewrittenFindings.length > 0) {
          const findingsToInsert = rewrittenFindings.map((f) => ({
            audit_id: auditId,
            category: f.category,
            severity: f.severity,
            title: f.title,
            description: f.description,
            file_path: f.filePath,
            line_start: f.lineStart,
            code_snippet: f.codeSnippet ?? null,
            fix_prompt: f.fixPrompt,
            deduction: f.deduction,
          }));

          const { error: insertError } = await admin.from("findings").insert(findingsToInsert);
          if (insertError) throw new Error(`Failed to insert findings: ${insertError.message}`);
        }
      });
    } finally {
      // Clean up temp directory
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    }
  }
);
