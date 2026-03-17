export type TrustStatus = "safe" | "low-risk" | "blocked" | "unknown";
export type SkillCompatibility = "best-fit" | "good-fit" | "possible-fit";

export interface Skill {
  id: string;
  slug: string;
  title: string;
  provider: string;
  source: string;
  source_repo_url: string | null;
  source_skill_url: string | null;
  description: string | null;
  official: boolean;
  is_active: boolean;
  trust_status: TrustStatus;
  trust_severity: string | null;
  trust_last_scanned_at: string | null;
  cached_skill_markdown: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillCategoryMapping {
  id: string;
  skill_id: string;
  category: string;
  compatibility: SkillCompatibility;
  priority: number;
  why_this_fits: string | null;
  created_at: string;
}

export interface RecommendedSkill {
  skill: Skill;
  compatibility: SkillCompatibility;
  why_this_fits: string | null;
}
