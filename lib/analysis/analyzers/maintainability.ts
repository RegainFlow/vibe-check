import type { FileEntry, RawFinding } from "@/lib/analysis/types";

const CODE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php"];
const LONG_FUNCTION_THRESHOLD = 50;
const DEEP_NESTING_THRESHOLD = 4;

function isCodeFile(ext: string): boolean {
  return CODE_EXTENSIONS.includes(ext);
}

function detectLongFunctions(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  // Match function declarations, arrow functions assigned to const/let/var, and methods
  const functionStartPattern =
    /^(?:export\s+)?(?:async\s+)?(?:function\s+\w+|(?:const|let|var)\s+\w+\s*=\s*(?:async\s+)?(?:\([^)]*\)|[a-zA-Z_]\w*)\s*=>|(?:public|private|protected)?\s*(?:async\s+)?\w+\s*\([^)]*\)\s*(?::\s*\S+\s*)?\{)/;

  let funcStart: number | null = null;
  let funcName = "";
  let braceDepth = 0;
  let inFunction = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comment lines
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;

    if (!inFunction && functionStartPattern.test(trimmed)) {
      funcStart = i;
      // Extract the function/variable name
      const nameMatch = trimmed.match(
        /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)|(?:public|private|protected)?\s*(?:async\s+)?(\w+)\s*\()/
      );
      funcName = nameMatch?.[1] || nameMatch?.[2] || nameMatch?.[3] || "anonymous";
      braceDepth = 0;
      inFunction = true;
    }

    if (inFunction) {
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }

      if (braceDepth <= 0 && funcStart !== null) {
        const funcLength = i - funcStart + 1;
        if (funcLength > LONG_FUNCTION_THRESHOLD) {
          findings.push({
            category: "maintainability",
            severity: "warning",
            patternId: "long-function",
            title: `Function '${funcName}' is ${funcLength} lines long (>${LONG_FUNCTION_THRESHOLD})`,
            filePath: file.relativePath,
            lineStart: funcStart + 1,
            lineEnd: i + 1,
            context: "Long functions are harder to understand and test. Break into smaller functions.",
          });
        }
        inFunction = false;
        funcStart = null;
      }
    }
  }

  return findings;
}

function detectDeepNesting(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");
  const reportedRanges: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines and comments
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("*")) continue;

    // Count leading whitespace to determine nesting level
    const leadingSpaces = line.match(/^(\s*)/)?.[1] || "";
    const tabCount = (leadingSpaces.match(/\t/g) || []).length;
    const spaceCount = (leadingSpaces.match(/ /g) || []).length;
    // Assume 2 spaces = 1 indent level, or 1 tab = 1 indent level
    const nestingLevel = tabCount + Math.floor(spaceCount / 2);

    if (nestingLevel > DEEP_NESTING_THRESHOLD) {
      // Avoid reporting every line in a deeply nested block
      const alreadyReported = reportedRanges.some(
        (reported) => Math.abs(reported - i) < 5
      );
      if (!alreadyReported) {
        reportedRanges.push(i);
        findings.push({
          category: "maintainability",
          severity: "warning",
          patternId: "deep-nesting",
          title: `Code nested ${nestingLevel} levels deep (>${DEEP_NESTING_THRESHOLD})`,
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: trimmed.substring(0, 120),
          context:
            "Deeply nested code is hard to read. Use early returns, extract functions, or restructure logic.",
        });
      }
    }
  }

  return findings;
}

function detectExcessiveAny(file: FileEntry): RawFinding[] {
  if (file.extension !== ".ts" && file.extension !== ".tsx") return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  // Patterns that indicate intentional/acceptable `any` usage
  const ignoredPatterns = [
    /eslint-disable/,
    /@ts-ignore/,
    /\/\/.*any/,
    /as\s+any\s*\/\//,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;
    if (ignoredPatterns.some((p) => p.test(line))) continue;

    // Match `: any`, `<any>`, `as any`, `any[]`, but not words containing "any" like "many", "company"
    const anyMatches = line.match(/(?::\s*any\b|<any>|as\s+any\b|\bany\[\]|\bany\s*[,)>|&])/g);
    if (anyMatches && anyMatches.length > 0) {
      findings.push({
        category: "maintainability",
        severity: "info",
        patternId: "excessive-any",
        title: "Use of 'any' type reduces type safety",
        filePath: file.relativePath,
        lineStart: i + 1,
        codeSnippet: trimmed.substring(0, 120),
        context: "Replace 'any' with a specific type or 'unknown' for better type safety.",
      });
    }
  }

  return findings;
}

function detectMagicNumbers(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");
  const reportedLines = new Set<number>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments, imports, const declarations
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;
    if (trimmed.startsWith("import ") || trimmed.startsWith("require(")) continue;

    // Skip const/let/var declarations with direct number assignment (these are named constants)
    if (/^\s*(?:export\s+)?(?:const|let|var|readonly)\s+\w+\s*(?::\s*\w+\s*)?=\s*\d/.test(line)) continue;

    // Skip array indices, common values (0, 1, -1, 2), and enums
    if (/^\s*(?:case|enum)\b/.test(trimmed)) continue;

    // Find numeric literals > 1 that aren't in const declarations
    const matches = Array.from(line.matchAll(/(?<![.\w])(\d+(?:\.\d+)?)(?![\w.])/g));
    for (const match of matches) {
      const num = parseFloat(match[1]);
      if (num <= 1 || isNaN(num)) continue;
      // Skip common status codes, ports, and obvious constants
      if ([100, 200, 201, 204, 301, 302, 400, 401, 403, 404, 500, 3000, 8080].includes(num)) continue;

      if (!reportedLines.has(i)) {
        reportedLines.add(i);
        findings.push({
          category: "maintainability",
          severity: "info",
          patternId: "magic-number",
          title: `Magic number ${match[1]} used directly`,
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: trimmed.substring(0, 120),
          context: "Extract magic numbers into named constants for better readability.",
        });
      }
    }
  }

  return findings;
}

export function analyze(files: FileEntry[]): RawFinding[] {
  const findings: RawFinding[] = [];

  for (const file of files) {
    findings.push(...detectLongFunctions(file));
    findings.push(...detectDeepNesting(file));
    findings.push(...detectExcessiveAny(file));
    findings.push(...detectMagicNumbers(file));
  }

  return findings;
}
