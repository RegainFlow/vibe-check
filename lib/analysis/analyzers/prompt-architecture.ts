import type { FileEntry, RawFinding } from "@/lib/analysis/types";

const CODE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".py"];

function isCodeFile(ext: string): boolean {
  return CODE_EXTENSIONS.includes(ext);
}

function detectHardcodedModelNames(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  const modelPatterns = [
    /["'`]gpt-4[^"'`]*["'`]/,
    /["'`]gpt-3\.5[^"'`]*["'`]/,
    /["'`]gpt-4o[^"'`]*["'`]/,
    /["'`]claude-[23][^"'`]*["'`]/,
    /["'`]claude-instant[^"'`]*["'`]/,
    /["'`]text-davinci[^"'`]*["'`]/,
    /["'`]text-embedding[^"'`]*["'`]/,
    /["'`]dall-e[^"'`]*["'`]/,
    /["'`]whisper[^"'`]*["'`]/,
    /["'`]gemini-[^"'`]*["'`]/,
    /["'`]o1-[^"'`]*["'`]/,
    /["'`]o3-[^"'`]*["'`]/,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;
    if (trimmed.startsWith("#")) continue;

    // Skip lines that are already defining a constant
    if (/^\s*(?:export\s+)?(?:const|let|var)\s+(?:MODEL|DEFAULT_MODEL|AI_MODEL|LLM_MODEL)\b/i.test(line)) continue;
    // Skip env variable fallbacks: process.env.MODEL || "gpt-4"
    if (/process\.env\.\w+\s*\|\|/.test(line) || /os\.environ/.test(line)) continue;

    for (const pattern of modelPatterns) {
      if (pattern.test(line)) {
        findings.push({
          category: "prompt-architecture",
          severity: "warning",
          patternId: "hardcoded-model-name",
          title: "Hardcoded AI model name",
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: trimmed.substring(0, 120),
          context:
            "Hardcoded model names make it difficult to switch models. Use environment variables or a config constant.",
        });
        break;
      }
    }
  }

  return findings;
}

function detectClientExposedPrompts(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];

  // Only check client-side files (components, pages, app directory non-api files)
  const isClientSide =
    (/[\\/]components?[\\/]/.test(file.relativePath) ||
      /[\\/]app[\\/]/.test(file.relativePath) ||
      /[\\/]pages[\\/]/.test(file.relativePath) ||
      /[\\/]src[\\/]/.test(file.relativePath)) &&
    !(/[\\/]api[\\/]/.test(file.relativePath) ||
      /[\\/]server[\\/]/.test(file.relativePath) ||
      /[\\/]lib[\\/]/.test(file.relativePath) ||
      /[\\/]utils[\\/]/.test(file.relativePath));

  if (!isClientSide) return [];

  // Check for "use client" directive or lack of "use server"
  const isExplicitlyClient =
    /["']use client["']/.test(file.content) ||
    !/["']use server["']/.test(file.content);

  if (!isExplicitlyClient) return [];

  const lines = file.content.split("\n");

  // Look for prompt-like strings: system prompts, role definitions, instructions to AI
  const promptPatterns = [
    /(?:system|user|assistant)\s*:\s*["'`](?:.{40,})/,
    /(?:system_prompt|systemPrompt|system_message|systemMessage)\s*[:=]\s*["'`]/,
    /(?:role|content)\s*:\s*["'`](?:you\s+are|act\s+as|respond\s+as|your\s+(?:role|task|job))/i,
    /(?:prompt|instruction|system)\s*[:=]\s*["'`](?:.{50,})/,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;

    for (const pattern of promptPatterns) {
      if (pattern.test(line)) {
        findings.push({
          category: "prompt-architecture",
          severity: "critical",
          patternId: "client-exposed-prompt",
          title: "AI prompt exposed in client-side code",
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: trimmed.substring(0, 80) + "...",
          context:
            "Prompts in client-side code are visible to users. Move prompts to API routes or server-side code.",
        });
        break;
      }
    }
  }

  return findings;
}

function detectMissingSanitization(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  // Look for LLM API calls that include user input without sanitization
  const llmCallPatterns = [
    /(?:openai|anthropic|ai)\s*\.\s*(?:chat|messages|completions?)\s*\.\s*create\s*\(/,
    /(?:createCompletion|createChatCompletion|generate)\s*\(/,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;

    for (const pattern of llmCallPatterns) {
      if (pattern.test(line)) {
        // Check surrounding context (20 lines before) for sanitization
        const contextBefore = lines.slice(Math.max(0, i - 20), i).join("\n");
        const hasSanitization =
          /(?:sanitize|escape|validate|clean|strip|filter|encode)\s*\(/.test(contextBefore) ||
          /(?:zod|yup|joi|ajv|validator)\b/.test(contextBefore) ||
          /\.(?:parse|safeParse|validate|check)\s*\(/.test(contextBefore);

        if (!hasSanitization) {
          findings.push({
            category: "prompt-architecture",
            severity: "warning",
            patternId: "missing-prompt-sanitization",
            title: "LLM API call without visible input sanitization",
            filePath: file.relativePath,
            lineStart: i + 1,
            codeSnippet: trimmed.substring(0, 120),
            context:
              "Validate and sanitize user input before passing it to LLM APIs to prevent prompt injection.",
          });
        }
        break;
      }
    }
  }

  return findings;
}

function detectDuplicatedPrompts(files: FileEntry[]): RawFinding[] {
  const findings: RawFinding[] = [];

  // Collect all prompt-like strings across files
  const promptStrings: { text: string; file: string; line: number }[] = [];

  const promptAssignmentPattern =
    /(?:prompt|system_prompt|systemPrompt|instruction|system_message|systemMessage)\s*[:=]\s*["'`]([^"'`]{30,})["'`]/;

  for (const file of files) {
    if (!isCodeFile(file.extension)) continue;
    const lines = file.content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(promptAssignmentPattern);
      if (match) {
        promptStrings.push({
          text: match[1].trim().toLowerCase(),
          file: file.relativePath,
          line: i + 1,
        });
      }
    }
  }

  // Find duplicates
  const seen = new Map<string, { file: string; line: number }>();
  for (const entry of promptStrings) {
    // Normalize whitespace for comparison
    const normalized = entry.text.replace(/\s+/g, " ").substring(0, 100);
    const existing = seen.get(normalized);

    if (existing) {
      findings.push({
        category: "prompt-architecture",
        severity: "info",
        patternId: "duplicated-prompt",
        title: "Duplicated prompt string found across files",
        filePath: entry.file,
        lineStart: entry.line,
        context: `Same prompt also appears in ${existing.file}:${existing.line}. Centralize prompts into a shared module.`,
      });
    } else {
      seen.set(normalized, { file: entry.file, line: entry.line });
    }
  }

  return findings;
}

export function analyze(files: FileEntry[]): RawFinding[] {
  const findings: RawFinding[] = [];

  for (const file of files) {
    findings.push(...detectHardcodedModelNames(file));
    findings.push(...detectClientExposedPrompts(file));
    findings.push(...detectMissingSanitization(file));
  }

  findings.push(...detectDuplicatedPrompts(files));

  return findings;
}
