import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import ScoreGauge from "@/components/audit/ScoreGauge";
import ScoreOverview from "@/components/audit/ScoreOverview";
import FindingsList from "@/components/audit/FindingsList";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const supabase = createAdminClient();
  const { data: audit } = await supabase
    .from("audits")
    .select("*")
    .eq("share_token", token)
    .single();

  if (!audit || audit.status !== "completed") {
    return { title: "Report Not Found" };
  }

  const scores = audit.scores as { overall: number; grade: string } | null;
  return {
    title: `VibeCheck Report — Score: ${scores?.overall ?? "N/A"}`,
    description: `Code audit report with an overall score of ${scores?.overall}/100 (Grade ${scores?.grade})`,
    openGraph: {
      title: `VibeCheck Report — Score: ${scores?.overall}/100`,
      description: `Code audit report with an overall score of ${scores?.overall}/100 (Grade ${scores?.grade})`,
      images: [`/api/og/${token}`],
    },
  };
}

export default async function SharedReportPage({ params }: Props) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: audit } = await supabase
    .from("audits")
    .select("*")
    .eq("share_token", token)
    .single();

  if (!audit || audit.status !== "completed") {
    notFound();
  }

  const { data: findings } = await supabase
    .from("findings")
    .select("*")
    .eq("audit_id", audit.id)
    .order("created_at", { ascending: true });

  const auditScores = audit.scores as {
    overall: number;
    grade: string;
    categories: Record<string, { score: number; grade: string; findingCount: number }>;
  } | null;
  const auditMetadata = audit.metadata as {
    repoName?: string;
    repoOwner?: string;
    totalFiles: number;
  } | null;

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header for shared reports */}
      <header className="border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              <span className="text-primary">Vibe</span>Check
            </span>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
              Shared Report
            </span>
          </div>
          <a
            href="/"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Run your own audit &rarr;
          </a>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Audit Report</h1>
            <p className="text-muted-foreground text-sm">
              {auditMetadata?.repoOwner}/{auditMetadata?.repoName} &middot;{" "}
              {audit.total_files} files analyzed
            </p>
          </div>

          {/* Overall Score */}
          {auditScores && (
            <>
              <div className="flex flex-col items-center mb-12 p-8 rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                  Launch Readiness Score
                </p>
                <ScoreGauge
                  score={auditScores.overall}
                  label="Overall"
                  size="lg"
                />
              </div>

              <ScoreOverview scores={auditScores as import("@/types/audit").AuditScores} />
            </>
          )}

          {/* Findings */}
          {findings && findings.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">Findings</h2>
              <FindingsList findings={findings as import("@/types/audit").Finding[]} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
