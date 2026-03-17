import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AuditScores, Finding } from "@/types/audit";

export interface SampleReportData {
  scores: AuditScores;
  metadata: { totalFiles: number; languages: Record<string, number> };
  findings: Finding[];
}

// --- PII scrubbing helpers ---

const PII_PATTERNS: [RegExp, string][] = [
  // URLs
  [/https?:\/\/[^\s),]+/gi, "[redacted-url]"],
  // Email addresses
  [/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[redacted-email]"],
  // IP addresses
  [/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[redacted-ip]"],
  // API key patterns (Stripe, GitHub, AWS, generic)
  [/\b(sk_live_|sk_test_|ghp_|gho_|ghu_|ghs_|AKIA|ASIA)[A-Za-z0-9_-]{10,}\b/g, "[redacted-key]"],
  // GitHub owner/repo references (e.g. "octocat/hello-world")
  [/\b[a-zA-Z0-9_-]{2,39}\/[a-zA-Z0-9._-]{1,100}\b/g, "developer/sample-project"],
];

function scrubPII(text: string): string {
  let result = text;
  for (const [pattern, replacement] of PII_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function sanitizeFilePath(filePath: string): string {
  // Keep only the last 3 segments (dir/dir/file) to strip usernames/org paths
  const segments = filePath.replace(/\\/g, "/").split("/").filter(Boolean);
  if (segments.length <= 3) return segments.join("/");
  return segments.slice(-3).join("/");
}

// --- Anonymization ---

function anonymizeFindings(findings: Finding[], fakeAuditId: string): Finding[] {
  return findings.map((f, i) => ({
    ...f,
    id: `sample-finding-${i}`,
    audit_id: fakeAuditId,
    code_snippet: null,
    file_path: sanitizeFilePath(f.file_path),
    description: scrubPII(f.description),
    fix_prompt: scrubPII(f.fix_prompt),
    title: scrubPII(f.title),
  }));
}

// --- Data fetching (cached, revalidates every hour) ---

async function fetchSampleReport(): Promise<SampleReportData | null> {
  const supabase = createAdminClient();
  const fakeAuditId = "sample-audit";

  // Fetch one completed audit with an interesting score range
  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .select("scores, metadata")
    .eq("status", "completed")
    .gte("overall_score", 30)
    .lte("overall_score", 85)
    .order("created_at", { ascending: false })
    .limit(20);

  if (auditError || !audit || audit.length === 0) return null;

  // Pick a random audit from the results for variety
  const picked = audit[Math.floor(Math.random() * audit.length)];
  const scores = picked.scores as AuditScores | null;
  const metadata = picked.metadata as { repoName?: string; repoOwner?: string; totalFiles: number; languages: Record<string, number> } | null;

  if (!scores || !metadata) return null;

  // We need the audit id to fetch findings — re-query with id
  const { data: auditWithId } = await supabase
    .from("audits")
    .select("id, scores, metadata")
    .eq("status", "completed")
    .eq("overall_score", scores.overall)
    .limit(1)
    .single();

  if (!auditWithId) return null;

  // Fetch findings for this audit
  const { data: findings, error: findingsError } = await supabase
    .from("findings")
    .select("*")
    .eq("audit_id", auditWithId.id);

  if (findingsError || !findings || findings.length === 0) return null;

  // Anonymize metadata
  const safeMetadata = {
    totalFiles: metadata.totalFiles,
    languages: metadata.languages,
  };

  return {
    scores,
    metadata: safeMetadata,
    findings: anonymizeFindings(findings as Finding[], fakeAuditId),
  };
}

export const getSampleReport = unstable_cache(fetchSampleReport, ["sample-report"], {
  revalidate: 3600, // 1 hour
});
