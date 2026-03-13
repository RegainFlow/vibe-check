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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Repositories you&apos;ve audited
          </p>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const repoName = extractRepoName(project.repo_url);
            const repoOwner = extractRepoOwner(project.repo_url);

            return (
              <div key={project.repo_url} className="glow-card p-6 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold font-mono text-sm truncate">
                      {repoName}
                    </h3>
                    {repoOwner && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {repoOwner}
                      </p>
                    )}
                  </div>
                  {project.overall_score !== null && (
                    <ScoreGauge score={project.overall_score} size="sm" />
                  )}
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  Last audit: {formatDate(project.created_at)}
                </p>

                <div className="flex items-center gap-2 mt-auto">
                  <Link
                    href={`/audit/${project.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-sm font-medium text-foreground hover:bg-white/[0.03] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Report
                  </Link>
                  <Link
                    href={`/audit?url=${encodeURIComponent(project.repo_url)}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg gradient-purple text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Re-scan
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 glow-card">
          <p className="text-muted-foreground mb-4">
            No projects yet. Run an audit to see your projects here.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start Your First Audit
          </Link>
        </div>
      )}
    </div>
  );
}
