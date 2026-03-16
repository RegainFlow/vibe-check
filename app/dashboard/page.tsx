import { createClient } from "@/lib/supabase/server";
import { AuditHistory } from "@/components/dashboard/AuditHistory";
import { Plus, BarChart3, FileCode, BookOpen } from "lucide-react";
import Link from "next/link";
import type { Audit } from "@/types/audit";
import { MotionDiv } from "@/components/shared/MotionWrapper";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: audits } = await supabase
    .from("audits")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const completedAudits = (audits ?? []).filter(
    (a) => a.status === "completed"
  );
  const avgScore =
    completedAudits.length > 0
      ? Math.round(
          completedAudits.reduce(
            (sum, a) => sum + (a.overall_score ?? 0),
            0
          ) / completedAudits.length
        )
      : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-indigo-900/30">
        <div>
          <h1 className="text-2xl font-mono font-bold uppercase tracking-tight text-foreground glow-text-magenta">Dashboard</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
          </p>
        </div>
        <Link
          href="/audit"
          className="rpg-button rpg-button-primary inline-flex items-center gap-2 px-6 py-2.5 text-xs h-auto"
        >
          <Plus className="w-4 h-4" />
          New Audit
        </Link>
      </div>

      {/* Stats */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rpg-panel p-6 bg-indigo-950/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border border-magenta/40 bg-indigo-950 flex items-center justify-center rotate-45">
                <FileCode className="w-5 h-5 text-magenta -rotate-45" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground ml-2">Total Audits</p>
            </div>
            <p className="stat-value text-4xl">{audits?.length ?? 0}</p>
          </div>
          <div className="rpg-panel p-6 bg-indigo-950/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border border-green-500/40 bg-indigo-950 flex items-center justify-center rotate-45">
                <BarChart3 className="w-5 h-5 text-green-400 -rotate-45" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground ml-2">Avg Score</p>
            </div>
            <p className="stat-value text-4xl text-green-400">{avgScore ?? "—"}</p>
          </div>
          <div className="rpg-panel p-6 bg-indigo-950/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border border-amber-500/40 bg-indigo-950 flex items-center justify-center rotate-45">
                <BarChart3 className="w-5 h-5 text-amber-400 -rotate-45" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground ml-2">This Month</p>
            </div>
            <p className="stat-value text-4xl text-amber-400">
              {profile?.audits_used_this_month ?? 0}
            </p>
          </div>
        </div>
      </MotionDiv>

      {/* Quick Actions */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/audit" className="group">
            <div className="rpg-panel p-6 bg-indigo-950/10 hover:bg-indigo-950/30 hover:border-magenta/50 transition-all flex items-center gap-6 group-hover:-translate-y-1">
              <div className="w-12 h-12 border border-magenta/20 bg-indigo-950 flex items-center justify-center shrink-0 group-hover:border-magenta transition-colors">
                <Plus className="w-6 h-6 text-magenta" />
              </div>
              <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-foreground group-hover:text-magenta transition-colors mb-1">New Audit</h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Scan a GitHub repo or upload a ZIP
                </p>
              </div>
            </div>
          </Link>
          <div className="rpg-panel p-6 bg-indigo-950/10 flex items-center gap-6 opacity-60">
            <div className="w-12 h-12 border border-indigo-900 bg-indigo-950 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-foreground mb-1">View Docs</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Learn about scoring and categories
              </p>
            </div>
          </div>
        </div>
      </MotionDiv>

      {/* Audit history */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        {audits && audits.length > 0 ? (
          <AuditHistory audits={audits as Audit[]} />
        ) : (
          <div className="text-center py-20 rpg-panel bg-indigo-950/10 border-indigo-900/50 flex flex-col items-center">
            <div className="w-16 h-16 border-2 border-magenta/30 bg-indigo-950 flex items-center justify-center rotate-45 mb-8">
              <FileCode className="w-8 h-8 text-magenta -rotate-45" />
            </div>
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-foreground mb-3">No audits yet</h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-8">
              Run your first code audit to get started
            </p>
            <Link
              href="/audit"
              className="rpg-button rpg-button-primary inline-flex items-center gap-2 px-8 py-3 text-xs"
            >
              <Plus className="w-4 h-4" />
              Start Your First Audit
            </Link>
          </div>
        )}
      </MotionDiv>
    </div>
  );
}
