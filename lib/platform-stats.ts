import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface PlatformStats {
  totalAudits: number;
  totalFindings: number;
  totalFilesScanned: number;
  distinctUsers: number;
}

async function fetchPlatformStats(): Promise<PlatformStats> {
  const supabase = createAdminClient();

  const [auditsRes, findingsRes, filesRes, usersRes] = await Promise.all([
    // Count completed audits
    supabase
      .from("audits")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),

    // Count all findings
    supabase
      .from("findings")
      .select("*", { count: "exact", head: true }),

    // Sum total_files from completed audits
    supabase
      .from("audits")
      .select("total_files")
      .eq("status", "completed"),

    // Distinct users from completed audits
    supabase
      .from("audits")
      .select("user_id")
      .eq("status", "completed"),
  ]);

  const totalAudits = auditsRes.count ?? 0;
  const totalFindings = findingsRes.count ?? 0;

  const totalFilesScanned = (filesRes.data ?? []).reduce(
    (sum, row) => sum + (row.total_files ?? 0),
    0
  );

  const distinctUsers = new Set(
    (usersRes.data ?? []).map((row) => row.user_id)
  ).size;

  return { totalAudits, totalFindings, totalFilesScanned, distinctUsers };
}

export const getPlatformStats = unstable_cache(
  fetchPlatformStats,
  ["platform-stats"],
  { revalidate: 3600 }
);
