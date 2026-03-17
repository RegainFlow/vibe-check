import type { Finding } from "@/types/audit";
import type { Skill } from "@/types/skills";
import { CATEGORY_LABELS, type AnalysisCategory } from "@/lib/constants";

export function buildClaudePrompt(finding: Finding, skill: Skill): string {
  return `You are fixing a ${CATEGORY_LABELS[finding.category]} issue in a codebase.

**Issue:** ${finding.title}
**Severity:** ${finding.severity}
**File:** ${finding.file_path}${finding.line_start ? `:${finding.line_start}` : ""}
**Details:** ${finding.description}

**Recommended Skill:** ${skill.title} by ${skill.provider}
**Skill Source:** ${skill.source_skill_url}

Apply the patterns from the skill above to fix this issue.
Focus on production-safe, scoped changes. Do not refactor unrelated code.`;
}

export function buildCodexPrompt(finding: Finding, skill: Skill): string {
  return `Fix the following ${finding.severity} ${CATEGORY_LABELS[finding.category]} issue.

File: ${finding.file_path}${finding.line_start ? `:${finding.line_start}` : ""}
Issue: ${finding.title}
Description: ${finding.description}
${finding.code_snippet ? `\nCode:\n\`\`\`\n${finding.code_snippet}\n\`\`\`` : ""}

Reference skill: ${skill.title} by ${skill.provider} (${skill.source_skill_url})

Apply the skill's patterns to implement a minimal, correct fix. Keep changes scoped to the issue.`;
}

export function buildVibeCheckFallbackPrompt(finding: Finding): string {
  return `Fix the following ${finding.severity} ${CATEGORY_LABELS[finding.category as AnalysisCategory]} issue.

File: ${finding.file_path}${finding.line_start ? `:${finding.line_start}` : ""}
Issue: ${finding.title}
Description: ${finding.description}
${finding.code_snippet ? `\nCode:\n\`\`\`\n${finding.code_snippet}\n\`\`\`` : ""}

${finding.fix_prompt}

Focus on production-safe, scoped changes. Do not refactor unrelated code.`;
}

export function buildSkillSourceUrl(skill: Skill): string {
  return skill.source_skill_url ?? "";
}
