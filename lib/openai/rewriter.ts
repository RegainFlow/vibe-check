import { getOpenAI } from "./client";
import type { RawFinding, ProcessedFinding } from "@/lib/analysis/types";
import { SEVERITY_DEDUCTIONS } from "@/lib/constants";

const BATCH_SIZE = 12;

const SYSTEM_PROMPT = `You are an expert code reviewer explaining issues to non-technical startup founders.

For each finding, produce:
1. "description" — A plain-English explanation of the issue and why it matters for their business (2-3 sentences, no jargon).
2. "fixPrompt" — A specific, actionable prompt they can paste into an AI coding assistant to fix the issue. Include the file path and be specific about what to change.

Respond with a JSON array of objects, each with "index" (number), "description" (string), and "fixPrompt" (string).
The "index" corresponds to the position in the input array (0-based).`;

interface RewrittenFinding {
  index: number;
  description: string;
  fixPrompt: string;
}

/**
 * Generate a basic fallback description when OpenAI is unavailable.
 */
function generateFallback(finding: RawFinding): { description: string; fixPrompt: string } {
  const severityLabel =
    finding.severity === "critical"
      ? "Critical issue"
      : finding.severity === "warning"
        ? "Potential issue"
        : "Minor observation";

  const description = `${severityLabel}: ${finding.title}. ${finding.context || `Found in ${finding.filePath} at line ${finding.lineStart}.`}`;

  const fixPrompt = `In the file ${finding.filePath} at line ${finding.lineStart}, ${finding.title.toLowerCase()}. ${finding.context || "Please review and fix this issue."}`;

  return { description, fixPrompt };
}

/**
 * Rewrite a batch of findings using GPT-4o for plain-English descriptions.
 */
async function rewriteBatch(
  findings: RawFinding[]
): Promise<RewrittenFinding[]> {
  const input = findings.map((f, i) => ({
    index: i,
    title: f.title,
    category: f.category,
    severity: f.severity,
    filePath: f.filePath,
    lineStart: f.lineStart,
    codeSnippet: f.codeSnippet || null,
    context: f.context || null,
  }));

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.3,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Rewrite these ${findings.length} code findings for a non-technical founder:\n\n${JSON.stringify(input, null, 2)}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  const parsed = JSON.parse(content);

  // Handle both { findings: [...] } and direct array formats
  const results: RewrittenFinding[] = Array.isArray(parsed)
    ? parsed
    : parsed.findings || parsed.results || parsed.items || [];

  return results;
}

/**
 * Rewrite raw findings into plain-English ProcessedFindings using GPT-4o.
 * Batches findings in groups of 10-15 for efficient API usage.
 * Falls back to basic descriptions if OpenAI is unavailable.
 */
export async function rewriteFindings(
  findings: RawFinding[]
): Promise<ProcessedFinding[]> {
  if (findings.length === 0) return [];

  const processed: ProcessedFinding[] = findings.map((f) => ({
    ...f,
    description: "",
    fixPrompt: "",
    deduction: SEVERITY_DEDUCTIONS[f.severity],
  }));

  // Split into batches
  const batches: RawFinding[][] = [];
  for (let i = 0; i < findings.length; i += BATCH_SIZE) {
    batches.push(findings.slice(i, i + BATCH_SIZE));
  }

  // Run all batches in parallel
  const results = await Promise.allSettled(
    batches.map((batch) => rewriteBatch(batch))
  );

  let globalOffset = 0;

  for (let b = 0; b < batches.length; b++) {
    const result = results[b];

    if (result.status === "fulfilled") {
      for (const item of result.value) {
        const globalIndex = globalOffset + item.index;
        if (globalIndex < processed.length) {
          processed[globalIndex].description = item.description;
          processed[globalIndex].fixPrompt = item.fixPrompt;
        }
      }
    } else {
      // Fallback: generate basic descriptions without OpenAI
      for (let i = 0; i < batches[b].length; i++) {
        const globalIndex = globalOffset + i;
        if (globalIndex < processed.length) {
          const fallback = generateFallback(batches[b][i]);
          processed[globalIndex].description = fallback.description;
          processed[globalIndex].fixPrompt = fallback.fixPrompt;
        }
      }
    }

    globalOffset += batches[b].length;
  }

  // Ensure no empty descriptions (final safety net)
  for (let i = 0; i < processed.length; i++) {
    if (!processed[i].description) {
      const fallback = generateFallback(findings[i]);
      processed[i].description = fallback.description;
      processed[i].fixPrompt = fallback.fixPrompt;
    }
  }

  return processed;
}
