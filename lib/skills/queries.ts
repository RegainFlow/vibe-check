import { createAdminClient } from "@/lib/supabase/admin";
import type { AnalysisCategory } from "@/lib/constants";
import type { RecommendedSkill, Skill, SkillCompatibility } from "@/types/skills";

const COMPATIBILITY_RANK: Record<SkillCompatibility, number> = {
  "best-fit": 0,
  "good-fit": 1,
  "possible-fit": 2,
};

export async function getRecommendedSkills(category: AnalysisCategory): Promise<{
  primary: RecommendedSkill | null;
  alternates: RecommendedSkill[];
}> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("skill_category_mappings")
    .select(`
      compatibility,
      why_this_fits,
      priority,
      skills (*)
    `)
    .eq("category", category)
    .eq("skills.is_active", true)
    .in("skills.trust_status", ["safe", "low-risk"])
    .order("priority", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch recommended skills:", error);
    return { primary: null, alternates: [] };
  }

  // Filter out rows where the joined skill was excluded by the filter
  const results: RecommendedSkill[] = data
    .filter((row) => row.skills !== null)
    .sort((a, b) => {
      const compDiff =
        COMPATIBILITY_RANK[a.compatibility as SkillCompatibility] -
        COMPATIBILITY_RANK[b.compatibility as SkillCompatibility];
      if (compDiff !== 0) return compDiff;
      return (b.priority ?? 0) - (a.priority ?? 0);
    })
    .map((row) => ({
      skill: row.skills as unknown as Skill,
      compatibility: row.compatibility as SkillCompatibility,
      why_this_fits: row.why_this_fits,
    }));

  return {
    primary: results[0] ?? null,
    alternates: results.slice(1, 3),
  };
}
