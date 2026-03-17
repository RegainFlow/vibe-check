import { createClient } from "@/lib/supabase/server";
import { ExternalLink, RotateCcw } from "lucide-react";
import Link from "next/link";
import ScoreGauge from "@/components/audit/ScoreGauge";

function extractRepoName(url: string): string {
  const match = url.match(/github\.com\/[\w.-]+\/([\w.-]+)/);
  return match?.[1] ?? url;
}

function extractRepoOwner(url: string): string {
  const match = url.match(/github\.com\/([\w.-]+)\//);
  return match?.[1] ?? "";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get unique repos with their latest completed audit
  const { data: audits } = await supabase
    .from("audits")
    .select("*")
    .eq("user_id", user!.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  // Group by repo URL and take the latest audit for each
  const projectMap = new Map<string, (typeof audits extends (infer T)[] | null ? T : never)>();
  for (const audit of audits ?? []) {
    if (!projectMap.has(audit.repo_url)) {
      projectMap.set(audit.repo_url, audit);
    }
  }
  const projects = Array.from(projectMap.values());

  return (
    <div>
      <div className="mb-8 pb-6 border-b border-indigo-900/30">
        <h1 className="text-2xl font-mono font-bold uppercase tracking-tight text-foreground glow-text-magenta">Projects</h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
          Repositories you&apos;ve audited
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const repoName = extractRepoName(project.repo_url);
            const repoOwner = extractRepoOwner(project.repo_url);

            return (
              <div key={project.repo_url} className="rpg-panel p-6 flex flex-col bg-indigo-950/20 hover:border-magenta/40 transition-all group">
                <div className="flex items-start justify-between gap-3 mb-6">
                  <div className="min-w-0">
                    <h3 className="font-mono text-sm font-bold uppercase tracking-tight truncate text-foreground group-hover:text-magenta transition-colors">
                      {repoName}
                    </h3>
                    {repoOwner && (
                      <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-1 flex items-center gap-1.5">
                        <span className="size-1 bg-indigo-900 rotate-45" />
                        {repoOwner}
                      </p>
                    )}
                  </div>
                  {project.overall_score !== null && (
                    <ScoreGauge score={project.overall_score} size="sm" />
                  )}
                </div>

                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-6">
                  Last audit: {formatDate(project.created_at)}
                </p>

                <div className="flex flex-col gap-2 mt-auto">
                  <Link
                    href={`/audit/${project.id}`}
                    className="rpg-button w-full flex items-center justify-center gap-2 py-2.5 text-[10px]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    VIEW REPORT
                  </Link>
                  <Link
                    href={`/audit?url=${encodeURIComponent(project.repo_url)}`}
                    className="rpg-button rpg-button-primary w-full flex items-center justify-center gap-2 py-2.5 text-[10px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    RE-SCAN
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rpg-panel bg-indigo-950/10 border-indigo-900/50 flex flex-col items-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-8">
            No projects yet. Run an audit to see your projects here.
          </p>
          <Link
            href="/audit"
            className="rpg-button rpg-button-primary inline-flex items-center gap-2 px-8 py-3 text-xs"
          >
            Start Your First Audit
          </Link>
        </div>
      )}
    </div>
  );
}
