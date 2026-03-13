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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
          </p>
        </div>
        <Link
          href="/audit"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Audit
        </Link>
      </div>

      {/* Stats */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glow-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
                <FileCode className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">Total Audits</p>
            </div>
            <p className="text-3xl font-bold">{audits?.length ?? 0}</p>
          </div>
          <div className="glow-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
            <p className="text-3xl font-bold">{avgScore ?? "—"}</p>
          </div>
          <div className="glow-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
            <p className="text-3xl font-bold">
              {profile?.audits_used_this_month ?? 0}
            </p>
          </div>
        </div>
      </MotionDiv>

      {/* Quick Actions */}
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/audit" className="group">
            <div className="glow-card p-6 border-primary/20 group-hover:border-primary/40 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center shrink-0">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">New Audit</h3>
                <p className="text-sm text-muted-foreground">
                  Scan a GitHub repo or upload a ZIP
                </p>
              </div>
            </div>
          </Link>
          <div className="glow-card p-6 flex items-center gap-4 opacity-60">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">View Docs</h3>
              <p className="text-sm text-muted-foreground">
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
          <div className="text-center py-20 glow-card">
            <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4">
              <FileCode className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No audits yet</h2>
            <p className="text-muted-foreground mb-6">
              Run your first code audit to get started
            </p>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
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
