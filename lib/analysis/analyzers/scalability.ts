import type { FileEntry, RawFinding } from "@/lib/analysis/types";

const CODE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php"];

function isCodeFile(ext: string): boolean {
  return CODE_EXTENSIONS.includes(ext);
}

function detectNPlusOneQueries(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  const loopPatterns = [
    /\bfor\s*\(/,
    /\bfor\s+of\b/,
    /\bfor\s+in\b/,
    /\bwhile\s*\(/,
    /\.forEach\s*\(/,
    /\.map\s*\(/,
  ];

  const queryPatterns = [
    /(?:prisma|mongoose|knex|sequelize|supabase)\s*\.\s*\w+\s*\.\s*(?:find|create|update|delete|select|insert|query)/,
    /\.(?:findOne|findUnique|findFirst|findMany|findById)\s*\(/,
    /(?:query|execute)\s*\(\s*["'`]/,
    /await\s+.*\.(?:get|fetch|post|put|patch|delete)\s*\(/,
  ];

  let inLoop = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;

    // Detect loop start
    if (!inLoop && loopPatterns.some((p) => p.test(trimmed))) {
      inLoop = true;
      braceDepth = 0;
    }

    if (inLoop) {
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }

      // Check for queries inside the loop
      if (queryPatterns.some((p) => p.test(line))) {
        findings.push({
          category: "scalability",
          severity: "critical",
          patternId: "n-plus-one-query",
          title: "Potential N+1 query pattern: database call inside a loop",
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: trimmed.substring(0, 120),
          context:
            "Queries inside loops cause N+1 performance issues. Batch queries or use eager loading/joins.",
        });
      }

      if (braceDepth <= 0) {
        inLoop = false;
      }
    }
  }

  return findings;
}

function detectMissingPagination(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;

    // Detect findMany / find / select without limit/take/pagination
    const unboundedPatterns = [
      /\.findMany\s*\(\s*\)/,
      /\.findMany\s*\(\s*\{(?![\s\S]*(?:take|limit|first|skip|cursor))/,
      /\.find\s*\(\s*\{?\s*\}?\s*\)(?!\s*\.(?:limit|take|slice))/,
      /\.select\s*\(\s*["'`]\*["'`]\s*\)(?![\s\S]*(?:LIMIT|limit|TOP|top))/,
    ];

    for (const pattern of unboundedPatterns) {
      // Look at this line plus next 3 lines for context
      const context = lines.slice(i, Math.min(i + 4, lines.length)).join("\n");
      if (pattern.test(context)) {
        // Double-check there's no limit in nearby lines
        const nearbyContext = lines.slice(i, Math.min(i + 6, lines.length)).join("\n");
        if (!/(?:take|limit|first|LIMIT|\.limit|\.take|\.slice)\s*[:(]/.test(nearbyContext)) {
          findings.push({
            category: "scalability",
            severity: "warning",
            patternId: "missing-pagination",
            title: "Database query without pagination or limit",
            filePath: file.relativePath,
            lineStart: i + 1,
            codeSnippet: trimmed.substring(0, 120),
            context:
              "Unbounded queries can return huge datasets and crash your app. Add take/limit and pagination.",
          });
          break;
        }
      }
    }
  }

  return findings;
}

function detectSyncFileOps(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  const syncPatterns = [
    { regex: /\bfs\.readFileSync\b/, name: "readFileSync" },
    { regex: /\bfs\.writeFileSync\b/, name: "writeFileSync" },
    { regex: /\bfs\.appendFileSync\b/, name: "appendFileSync" },
    { regex: /\bfs\.mkdirSync\b/, name: "mkdirSync" },
    { regex: /\bfs\.readdirSync\b/, name: "readdirSync" },
    { regex: /\bfs\.statSync\b/, name: "statSync" },
    { regex: /\bfs\.existsSync\b/, name: "existsSync" },
    { regex: /\bfs\.unlinkSync\b/, name: "unlinkSync" },
    { regex: /\bfs\.copyFileSync\b/, name: "copyFileSync" },
    { regex: /\bfs\.renameSync\b/, name: "renameSync" },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments and imports
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;
    if (trimmed.startsWith("import ") || trimmed.startsWith("require(")) continue;

    for (const { regex, name } of syncPatterns) {
      if (regex.test(line)) {
        findings.push({
          category: "scalability",
          severity: "warning",
          patternId: "sync-file-op",
          title: `Synchronous file operation: ${name}`,
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: trimmed.substring(0, 120),
          context:
            "Synchronous file I/O blocks the event loop. Use async equivalents (fs.promises or callbacks).",
        });
        break;
      }
    }
  }

  return findings;
}

function detectLargeDefaultImports(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  const largeLibraries = [
    { regex: /import\s+(?:\w+\s+from\s+)?["']lodash["']/, name: "lodash" },
    { regex: /import\s+(?:\w+\s+from\s+)?["']moment["']/, name: "moment" },
    { regex: /import\s+(?:\w+\s+from\s+)?["']underscore["']/, name: "underscore" },
    { regex: /import\s+(?:\w+\s+from\s+)?["']rxjs["']/, name: "rxjs" },
    { regex: /(?:const|let|var)\s+\w+\s*=\s*require\(\s*["']lodash["']\s*\)/, name: "lodash" },
    { regex: /(?:const|let|var)\s+\w+\s*=\s*require\(\s*["']moment["']\s*\)/, name: "moment" },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const { regex, name } of largeLibraries) {
      if (regex.test(line)) {
        findings.push({
          category: "scalability",
          severity: "info",
          patternId: "large-default-import",
          title: `Full import of '${name}' increases bundle size`,
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: line.trim().substring(0, 120),
          context: `Import specific functions (e.g., '${name}/get') or use a lighter alternative to reduce bundle size.`,
        });
        break;
      }
    }
  }

  return findings;
}

export function analyze(files: FileEntry[]): RawFinding[] {
  const findings: RawFinding[] = [];

  for (const file of files) {
    findings.push(...detectNPlusOneQueries(file));
    findings.push(...detectMissingPagination(file));
    findings.push(...detectSyncFileOps(file));
    findings.push(...detectLargeDefaultImports(file));
  }

  return findings;
}
