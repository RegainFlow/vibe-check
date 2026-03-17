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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 rpg-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 dungeon-gradient pointer-events-none" />
      <div className="scanline" />

      {/* Simple header for shared reports */}
      <header className="border-b border-indigo-900/50 bg-indigo-950/20 backdrop-blur-xl relative z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono font-bold tracking-tighter text-foreground uppercase glow-text-magenta">
              VibeCheck
            </span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground border border-indigo-900/50 bg-indigo-950 px-2 py-1">
              Shared Report
            </span>
          </div>
          <a
            href="/"
            className="font-mono text-[10px] uppercase tracking-widest text-magenta hover:text-white transition-colors"
          >
            Run your own audit &rarr;
          </a>
        </div>
      </header>

      <main className="py-16 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-2xl sm:text-4xl font-mono font-bold uppercase tracking-tighter mb-2 text-foreground glow-text-magenta">Audit Report</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="text-magenta">{auditMetadata?.repoOwner}/{auditMetadata?.repoName}</span>
              <span className="size-1 bg-indigo-900 rotate-45" />
              {audit.total_files} files analyzed
            </p>
          </div>

          {/* Overall Score */}
          {auditScores && (
            <>
              <div className="relative flex flex-col items-center mb-16 p-12 rpg-panel bg-indigo-950/20 overflow-hidden">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.4em] text-magenta/80 mb-6 text-center">
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
            <div className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-mono text-lg font-bold uppercase tracking-[0.2em] text-foreground">Findings</h2>
                <div className="h-px flex-1 bg-indigo-900/30" />
              </div>
              <FindingsList findings={findings as import("@/types/audit").Finding[]} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
