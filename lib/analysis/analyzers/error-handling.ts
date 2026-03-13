import type { FileEntry, RawFinding } from "@/lib/analysis/types";

const CODE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php"];

function isCodeFile(ext: string): boolean {
  return CODE_EXTENSIONS.includes(ext);
}

function detectEmptyCatchBlocks(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Single-line empty catch: catch(e) {} or catch {} or catch(e) { }
    if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(trimmed) || /catch\s*\{\s*\}/.test(trimmed)) {
      findings.push({
        category: "error-handling",
        severity: "critical",
        patternId: "empty-catch",
        title: "Empty catch block silently swallows errors",
        filePath: file.relativePath,
        lineStart: i + 1,
        codeSnippet: trimmed.substring(0, 120),
        context: "At minimum, log the error. Silent failures make debugging impossible.",
      });
      continue;
    }

    // Multi-line empty catch: catch block followed by empty line then closing brace
    if (/catch\s*\(?[^)]*\)?\s*\{\s*$/.test(trimmed)) {
      // Look at the next non-empty line
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length && lines[j].trim() === "}") {
        findings.push({
          category: "error-handling",
          severity: "critical",
          patternId: "empty-catch",
          title: "Empty catch block silently swallows errors",
          filePath: file.relativePath,
          lineStart: i + 1,
          lineEnd: j + 1,
          codeSnippet: trimmed.substring(0, 120),
          context: "At minimum, log the error. Silent failures make debugging impossible.",
        });
      }
    }
  }

  return findings;
}

function detectMissingTryCatch(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  // Track async function boundaries and whether they have try/catch
  let inAsyncFunction = false;
  let asyncFuncStart = 0;
  let asyncFuncName = "";
  let braceDepth = 0;
  let hasTryCatch = false;
  let hasAwait = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;

    // Detect async function start
    const asyncMatch = trimmed.match(
      /(?:export\s+)?async\s+(?:function\s+(\w+)|(\w+)\s*\()|(?:const|let|var)\s+(\w+)\s*=\s*async/
    );

    if (asyncMatch && !inAsyncFunction) {
      inAsyncFunction = true;
      asyncFuncStart = i;
      asyncFuncName = asyncMatch[1] || asyncMatch[2] || asyncMatch[3] || "anonymous";
      braceDepth = 0;
      hasTryCatch = false;
      hasAwait = false;
    }

    if (inAsyncFunction) {
      if (/\btry\s*\{/.test(trimmed)) hasTryCatch = true;
      if (/\bawait\b/.test(trimmed)) hasAwait = true;

      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }

      if (braceDepth <= 0) {
        if (hasAwait && !hasTryCatch) {
          findings.push({
            category: "error-handling",
            severity: "warning",
            patternId: "missing-try-catch",
            title: `Async function '${asyncFuncName}' lacks try/catch for await calls`,
            filePath: file.relativePath,
            lineStart: asyncFuncStart + 1,
            lineEnd: i + 1,
            context:
              "Unhandled await rejections can crash the process. Wrap in try/catch or add .catch().",
          });
        }
        inAsyncFunction = false;
      }
    }
  }

  return findings;
}

function detectUnhandledPromises(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;

    // Detect .then() without .catch() on the same line or next few lines
    if (/\.then\s*\(/.test(line) && !/\.catch\s*\(/.test(line)) {
      // Check the next 3 lines for a .catch
      let hasCatch = false;
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        if (/\.catch\s*\(/.test(lines[j])) {
          hasCatch = true;
          break;
        }
        // If we hit a semicolon or closing brace without catch, stop looking
        if (/;\s*$/.test(lines[j].trim()) || lines[j].trim() === "}") break;
      }

      if (!hasCatch) {
        findings.push({
          category: "error-handling",
          severity: "warning",
          patternId: "unhandled-promise",
          title: "Promise .then() without .catch() handler",
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: trimmed.substring(0, 120),
          context:
            "Unhandled promise rejections can cause silent failures. Add .catch() or use async/await with try/catch.",
        });
      }
    }
  }

  return findings;
}

export function analyze(files: FileEntry[]): RawFinding[] {
  const findings: RawFinding[] = [];

  for (const file of files) {
    findings.push(...detectEmptyCatchBlocks(file));
    findings.push(...detectMissingTryCatch(file));
    findings.push(...detectUnhandledPromises(file));
  }

  return findings;
}
