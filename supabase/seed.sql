-- Seed: skills catalog
--
-- Curated from: https://github.com/VoltAgent/awesome-agent-skills
-- Trust scanned via: https://ai.gendigital.com/agent-trust-hub

INSERT INTO public.skills (slug, title, provider, source, source_repo_url, source_skill_url, description, official, is_active, trust_status) VALUES
  -- Trail of Bits
  ('tob-insecure-defaults', 'Insecure Defaults', 'Trail of Bits', 'awesome-agent-skills', 'https://github.com/trailofbits/skills', 'https://github.com/trailofbits/skills/tree/main/plugins/insecure-defaults', 'Detects insecure default configurations and suggests safer alternatives.', true, true, 'safe'),
  ('tob-static-analysis', 'Static Analysis', 'Trail of Bits', 'awesome-agent-skills', 'https://github.com/trailofbits/skills', 'https://github.com/trailofbits/skills/tree/main/plugins/static-analysis', 'Guides agents to run and interpret static analysis tools on the codebase.', true, true, 'safe'),
  ('tob-sharp-edges', 'Sharp Edges', 'Trail of Bits', 'awesome-agent-skills', 'https://github.com/trailofbits/skills', 'https://github.com/trailofbits/skills/tree/main/plugins/sharp-edges', 'Identifies language-specific footguns and subtle misuse patterns.', true, true, 'safe'),
  ('tob-fix-review', 'Fix Review', 'Trail of Bits', 'awesome-agent-skills', 'https://github.com/trailofbits/skills', 'https://github.com/trailofbits/skills/tree/main/plugins/fix-review', 'Reviews proposed fixes for correctness, completeness, and regressions.', true, true, 'safe'),
  ('tob-audit-context-building', 'Audit Context Building', 'Trail of Bits', 'awesome-agent-skills', 'https://github.com/trailofbits/skills', 'https://github.com/trailofbits/skills/tree/main/plugins/audit-context-building', 'Builds rich context about a codebase to improve audit quality.', true, true, 'safe'),
  ('tob-modern-python', 'Modern Python', 'Trail of Bits', 'awesome-agent-skills', 'https://github.com/trailofbits/skills', 'https://github.com/trailofbits/skills/tree/main/plugins/modern-python', 'Enforces modern Python idioms, type hints, and best practices.', true, true, 'safe'),
  ('tob-variant-analysis', 'Variant Analysis', 'Trail of Bits', 'awesome-agent-skills', 'https://github.com/trailofbits/skills', 'https://github.com/trailofbits/skills/tree/main/plugins/variant-analysis', 'Finds similar vulnerability patterns across the codebase after a bug is identified.', true, true, 'safe'),
  ('tob-ask-questions', 'Ask Questions If Underspecified', 'Trail of Bits', 'awesome-agent-skills', 'https://github.com/trailofbits/skills', 'https://github.com/trailofbits/skills/tree/main/plugins/ask-questions-if-underspecified', 'Teaches agents to ask clarifying questions before making changes.', true, true, 'safe'),
  -- OpenAI
  ('openai-security-best-practices', 'Security Best Practices', 'OpenAI', 'awesome-agent-skills', 'https://github.com/openai/skills', 'https://github.com/openai/skills/tree/main/skills/.curated/security-best-practices', 'Comprehensive security best practices for web applications.', true, true, 'safe'),
  ('openai-security-threat-model', 'Security Threat Model', 'OpenAI', 'awesome-agent-skills', 'https://github.com/openai/skills', 'https://github.com/openai/skills/tree/main/skills/.curated/security-threat-model', 'Guides agents to think about threat models when reviewing code.', true, true, 'safe'),
  ('openai-sentry', 'Sentry Integration', 'OpenAI', 'awesome-agent-skills', 'https://github.com/openai/skills', 'https://github.com/openai/skills/tree/main/skills/.curated/sentry', 'Best practices for Sentry error tracking integration.', true, true, 'safe'),
  ('openai-gh-address-comments', 'Address GitHub Comments', 'OpenAI', 'awesome-agent-skills', 'https://github.com/openai/skills', 'https://github.com/openai/skills/tree/main/skills/.curated/gh-address-comments', 'Helps agents systematically address PR review comments.', true, true, 'safe'),
  -- Vercel
  ('vercel-composition-patterns', 'Composition Patterns', 'Vercel', 'awesome-agent-skills', 'https://github.com/vercel-labs/agent-skills', 'https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns', 'React component composition patterns for scalable UI architecture.', true, true, 'safe'),
  ('vercel-react-best-practices', 'React Best Practices', 'Vercel', 'awesome-agent-skills', 'https://github.com/vercel-labs/agent-skills', 'https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices', 'Idiomatic React patterns including hooks, state management, and rendering.', true, true, 'safe'),
  ('vercel-next-best-practices', 'Next.js Best Practices', 'Vercel', 'awesome-agent-skills', 'https://github.com/vercel-labs/next-skills', 'https://github.com/vercel-labs/next-skills/tree/main/skills/next-best-practices', 'Next.js App Router patterns, server components, and data fetching.', true, true, 'safe'),
  ('vercel-next-cache-components', 'Next.js Cache & Components', 'Vercel', 'awesome-agent-skills', 'https://github.com/vercel-labs/next-skills', 'https://github.com/vercel-labs/next-skills/tree/main/skills/next-cache-components', 'Caching strategies and component patterns for Next.js performance.', true, true, 'safe'),
  -- Sentry
  ('sentry-code-review', 'Code Review', 'Sentry', 'awesome-agent-skills', 'https://github.com/getsentry/skills', 'https://github.com/getsentry/skills/tree/main/plugins/sentry-skills/skills/code-review', 'Structured code review focusing on bugs, performance, and maintainability.', true, true, 'safe'),
  ('sentry-find-bugs', 'Find Bugs', 'Sentry', 'awesome-agent-skills', 'https://github.com/getsentry/skills', 'https://github.com/getsentry/skills/tree/main/plugins/sentry-skills/skills/find-bugs', 'Systematic bug detection patterns for common failure modes.', true, true, 'safe'),
  ('sentry-agents-md', 'Agents.md', 'Sentry', 'awesome-agent-skills', 'https://github.com/getsentry/skills', 'https://github.com/getsentry/skills/tree/main/plugins/sentry-skills/skills/agents-md', 'Best practices for creating agents.md project configuration files.', true, true, 'safe'),
  -- Google Labs
  ('google-enhance-prompt', 'Enhance Prompt', 'Google Labs', 'awesome-agent-skills', 'https://github.com/google-labs-code/stitch-skills', 'https://github.com/google-labs-code/stitch-skills/tree/main/skills/enhance-prompt', 'Improves and refines prompts for better AI agent interactions.', true, true, 'safe'),
  ('google-design-md', 'Design.md', 'Google Labs', 'awesome-agent-skills', 'https://github.com/google-labs-code/stitch-skills', 'https://github.com/google-labs-code/stitch-skills/tree/main/skills/design-md', 'Generates design documents for proposed changes before implementation.', true, true, 'safe'),
  ('google-stitch-loop', 'Stitch Loop', 'Google Labs', 'awesome-agent-skills', 'https://github.com/google-labs-code/stitch-skills', 'https://github.com/google-labs-code/stitch-skills/tree/main/skills/stitch-loop', 'Iterative refinement loop for code generation and testing.', true, true, 'safe'),
  ('google-shadcn-ui', 'shadcn/ui', 'Google Labs', 'awesome-agent-skills', 'https://github.com/google-labs-code/stitch-skills', 'https://github.com/google-labs-code/stitch-skills/tree/main/skills/shadcn-ui', 'Best practices for using shadcn/ui component library.', true, true, 'safe'),
  -- Cloudflare
  ('cf-web-perf', 'Web Performance', 'Cloudflare', 'awesome-agent-skills', 'https://github.com/cloudflare/skills', 'https://github.com/cloudflare/skills/tree/main/skills/web-perf', 'Web performance optimization patterns and best practices.', true, true, 'safe'),
  ('cf-durable-objects', 'Durable Objects', 'Cloudflare', 'awesome-agent-skills', 'https://github.com/cloudflare/skills', 'https://github.com/cloudflare/skills/tree/main/skills/durable-objects', 'Patterns for building stateful applications with Cloudflare Durable Objects.', true, true, 'safe')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  provider = EXCLUDED.provider,
  source_repo_url = EXCLUDED.source_repo_url,
  source_skill_url = EXCLUDED.source_skill_url,
  description = EXCLUDED.description,
  official = EXCLUDED.official,
  is_active = EXCLUDED.is_active,
  trust_status = EXCLUDED.trust_status;

-- Seed: skill-to-category mappings

INSERT INTO public.skill_category_mappings (skill_id, category, compatibility, priority, why_this_fits)
VALUES
  -- Security
  ((SELECT id FROM public.skills WHERE slug = 'tob-insecure-defaults'), 'security', 'best-fit', 10, 'Directly targets insecure default configurations — the most common source of security findings.'),
  ((SELECT id FROM public.skills WHERE slug = 'openai-security-best-practices'), 'security', 'best-fit', 9, 'Comprehensive security checklist covering OWASP top 10 and web application hardening.'),
  ((SELECT id FROM public.skills WHERE slug = 'openai-security-threat-model'), 'security', 'good-fit', 8, 'Helps reason about attack surface and threat vectors relevant to the finding.'),
  ((SELECT id FROM public.skills WHERE slug = 'tob-variant-analysis'), 'security', 'good-fit', 7, 'After fixing one security issue, finds similar patterns elsewhere in the codebase.'),
  ((SELECT id FROM public.skills WHERE slug = 'tob-static-analysis'), 'security', 'good-fit', 6, 'Guides running security-focused static analysis tools to find related issues.'),
  -- Architecture
  ((SELECT id FROM public.skills WHERE slug = 'vercel-composition-patterns'), 'architecture', 'best-fit', 10, 'Component composition patterns directly address architectural coupling and separation of concerns.'),
  ((SELECT id FROM public.skills WHERE slug = 'vercel-next-best-practices'), 'architecture', 'best-fit', 9, 'Next.js App Router architecture patterns for server/client component boundaries.'),
  ((SELECT id FROM public.skills WHERE slug = 'google-design-md'), 'architecture', 'good-fit', 8, 'Helps create a design document before refactoring, ensuring architectural changes are intentional.'),
  ((SELECT id FROM public.skills WHERE slug = 'tob-audit-context-building'), 'architecture', 'good-fit', 7, 'Builds understanding of existing architecture before making structural changes.'),
  -- Maintainability
  ((SELECT id FROM public.skills WHERE slug = 'sentry-code-review'), 'maintainability', 'best-fit', 10, 'Structured code review patterns that improve readability, naming, and code organization.'),
  ((SELECT id FROM public.skills WHERE slug = 'vercel-react-best-practices'), 'maintainability', 'good-fit', 9, 'Idiomatic React patterns reduce complexity and improve long-term maintainability.'),
  ((SELECT id FROM public.skills WHERE slug = 'tob-modern-python'), 'maintainability', 'possible-fit', 5, 'Modern language idioms improve readability — applicable if the project uses Python.'),
  ((SELECT id FROM public.skills WHERE slug = 'tob-sharp-edges'), 'maintainability', 'good-fit', 7, 'Identifies subtle language footguns that make code harder to maintain safely.'),
  -- Error Handling
  ((SELECT id FROM public.skills WHERE slug = 'sentry-find-bugs'), 'error-handling', 'best-fit', 10, 'Systematic bug detection patterns including unhandled edge cases and error paths.'),
  ((SELECT id FROM public.skills WHERE slug = 'openai-sentry'), 'error-handling', 'good-fit', 9, 'Sentry integration best practices for capturing and tracking errors in production.'),
  ((SELECT id FROM public.skills WHERE slug = 'tob-fix-review'), 'error-handling', 'good-fit', 8, 'Reviews error handling fixes for completeness and prevents introducing regressions.'),
  -- Scalability
  ((SELECT id FROM public.skills WHERE slug = 'vercel-next-cache-components'), 'scalability', 'best-fit', 10, 'Caching strategies and component patterns that directly improve application performance.'),
  ((SELECT id FROM public.skills WHERE slug = 'cf-web-perf'), 'scalability', 'best-fit', 9, 'Web performance optimization patterns from Cloudflare''s edge computing expertise.'),
  ((SELECT id FROM public.skills WHERE slug = 'google-stitch-loop'), 'scalability', 'possible-fit', 5, 'Iterative testing loop helps verify that performance improvements don''t regress.'),
  -- Tech Debt
  ((SELECT id FROM public.skills WHERE slug = 'tob-static-analysis'), 'tech-debt', 'best-fit', 10, 'Static analysis tools catch code smells, dead code, and complexity hotspots.'),
  ((SELECT id FROM public.skills WHERE slug = 'sentry-code-review'), 'tech-debt', 'good-fit', 9, 'Structured review helps identify and prioritize tech debt reduction.'),
  ((SELECT id FROM public.skills WHERE slug = 'tob-sharp-edges'), 'tech-debt', 'good-fit', 8, 'Language-specific footguns often accumulate as tech debt over time.'),
  ((SELECT id FROM public.skills WHERE slug = 'openai-gh-address-comments'), 'tech-debt', 'possible-fit', 5, 'Helps systematically address review feedback that often flags tech debt.'),
  -- Prompt Architecture
  ((SELECT id FROM public.skills WHERE slug = 'google-enhance-prompt'), 'prompt-architecture', 'best-fit', 10, 'Directly improves prompt quality, structure, and effectiveness.'),
  ((SELECT id FROM public.skills WHERE slug = 'sentry-agents-md'), 'prompt-architecture', 'best-fit', 9, 'Best practices for agent configuration files that define prompt behavior.'),
  ((SELECT id FROM public.skills WHERE slug = 'google-design-md'), 'prompt-architecture', 'good-fit', 8, 'Design documents help plan prompt architectures before implementation.'),
  ((SELECT id FROM public.skills WHERE slug = 'tob-ask-questions'), 'prompt-architecture', 'good-fit', 7, 'Teaches agents to handle ambiguity — a core prompt architecture concern.')
ON CONFLICT (skill_id, category) DO UPDATE SET
  compatibility = EXCLUDED.compatibility,
  priority = EXCLUDED.priority,
  why_this_fits = EXCLUDED.why_this_fits;
