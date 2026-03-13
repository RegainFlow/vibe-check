import type { FileEntry, RawFinding } from "@/lib/analysis/types";

const CODE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php"];

function isCodeFile(ext: string): boolean {
  return CODE_EXTENSIONS.includes(ext);
}

function detectTodoComments(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  const todoPattern = /\b(TODO|FIXME|HACK|XXX)\b/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(todoPattern);

    if (match) {
      const tag = match[1].toUpperCase();
      const severity = tag === "HACK" || tag === "FIXME" ? "warning" : "info";

      findings.push({
        category: "tech-debt",
        severity,
        patternId: `todo-comment-${tag.toLowerCase()}`,
        title: `${tag} comment found`,
        filePath: file.relativePath,
        lineStart: i + 1,
        codeSnippet: line.trim().substring(0, 120),
        context: `${tag} comments indicate unfinished work or known issues that should be tracked and resolved.`,
      });
    }
  }

  return findings;
}

function detectCommentedOutCode(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  // Patterns that look like commented-out code rather than documentation comments
  const codeLikePatterns = [
    /^\s*\/\/\s*(?:const|let|var|function|class|import|export|return|if|else|for|while|switch)\b/,
    /^\s*\/\/\s*\w+\s*[=(]\s*/,
    /^\s*\/\/\s*\}\s*(?:else|catch|finally)?/,
    /^\s*\/\/\s*(?:await|async)\s+/,
    /^\s*\/\/\s*\w+\.\w+\s*\(/,
  ];

  let consecutiveCommentedCode = 0;
  let blockStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isCommentedCode = codeLikePatterns.some((p) => p.test(line));

    if (isCommentedCode) {
      if (consecutiveCommentedCode === 0) {
        blockStart = i;
      }
      consecutiveCommentedCode++;
    } else {
      if (consecutiveCommentedCode >= 3) {
        findings.push({
          category: "tech-debt",
          severity: "info",
          patternId: "commented-out-code",
          title: `Block of commented-out code (${consecutiveCommentedCode} lines)`,
          filePath: file.relativePath,
          lineStart: blockStart + 1,
          lineEnd: blockStart + consecutiveCommentedCode,
          context:
            "Commented-out code adds noise. Remove it and rely on version control for history.",
        });
      }
      consecutiveCommentedCode = 0;
    }
  }

  // Handle trailing block
  if (consecutiveCommentedCode >= 3) {
    findings.push({
      category: "tech-debt",
      severity: "info",
      patternId: "commented-out-code",
      title: `Block of commented-out code (${consecutiveCommentedCode} lines)`,
      filePath: file.relativePath,
      lineStart: blockStart + 1,
      lineEnd: blockStart + consecutiveCommentedCode,
      context:
        "Commented-out code adds noise. Remove it and rely on version control for history.",
    });
  }

  return findings;
}

function detectMixedModuleSystems(file: FileEntry): RawFinding[] {
  if (file.extension !== ".ts" && file.extension !== ".tsx" &&
      file.extension !== ".js" && file.extension !== ".jsx") {
    return [];
  }

  const content = file.content;

  // Check for ESM imports/exports
  const hasESM =
    /(?:^|\n)\s*import\s+/.test(content) ||
    /(?:^|\n)\s*export\s+(?:default\s+|const\s+|function\s+|class\s+|{)/.test(content);

  // Check for CJS require/module.exports (exclude dynamic imports and type imports)
  const hasCJS =
    /(?:^|\n)\s*(?:const|let|var)\s+\w+\s*=\s*require\s*\(/.test(content) ||
    /(?:^|\n)\s*module\.exports\b/.test(content) ||
    /(?:^|\n)\s*exports\.\w+\s*=/.test(content);

  if (hasESM && hasCJS) {
    // Find the first require() line
    const lines = content.split("\n");
    let requireLine = 1;
    for (let i = 0; i < lines.length; i++) {
      if (/require\s*\(/.test(lines[i]) || /module\.exports/.test(lines[i])) {
        requireLine = i + 1;
        break;
      }
    }

    return [
      {
        category: "tech-debt",
        severity: "warning",
        patternId: "mixed-module-systems",
        title: "File mixes CommonJS and ESM module syntax",
        filePath: file.relativePath,
        lineStart: requireLine,
        context:
          "Using both require() and import/export in the same file causes confusion. Pick one module system.",
      },
    ];
  }

  return [];
}

function detectDeprecatedPatterns(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  const deprecatedPatterns = [
    {
      regex: /\bcomponentWillMount\b/,
      id: "deprecated-cwm",
      title: "Deprecated componentWillMount lifecycle",
      context: "Use componentDidMount or useEffect hook instead.",
    },
    {
      regex: /\bcomponentWillReceiveProps\b/,
      id: "deprecated-cwrp",
      title: "Deprecated componentWillReceiveProps lifecycle",
      context: "Use getDerivedStateFromProps or useEffect hook instead.",
    },
    {
      regex: /\bcomponentWillUpdate\b/,
      id: "deprecated-cwu",
      title: "Deprecated componentWillUpdate lifecycle",
      context: "Use componentDidUpdate or useEffect hook instead.",
    },
    {
      regex: /\bsubstr\s*\(/,
      id: "deprecated-substr",
      title: "Deprecated String.substr() usage",
      context: "Use String.substring() or String.slice() instead.",
    },
    {
      regex: /\b__defineGetter__\b|\b__defineSetter__\b/,
      id: "deprecated-define-getter-setter",
      title: "Deprecated __defineGetter__/__defineSetter__",
      context: "Use Object.defineProperty() instead.",
    },
    {
      regex: /\bnew\s+Buffer\s*\(/,
      id: "deprecated-buffer-constructor",
      title: "Deprecated Buffer constructor",
      context: "Use Buffer.from(), Buffer.alloc(), or Buffer.allocUnsafe() instead.",
    },
    {
      regex: /\butilityTypes\s*\.\s*Omit\b/,
      id: "deprecated-utility-import",
      title: "Deprecated utility type import pattern",
      context: "Use built-in TypeScript utility types directly.",
    },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;

    for (const pattern of deprecatedPatterns) {
      if (pattern.regex.test(line)) {
        findings.push({
          category: "tech-debt",
          severity: "warning",
          patternId: pattern.id,
          title: pattern.title,
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: trimmed.substring(0, 120),
          context: pattern.context,
        });
      }
    }
  }

  return findings;
}

export function analyze(files: FileEntry[]): RawFinding[] {
  const findings: RawFinding[] = [];

  for (const file of files) {
    findings.push(...detectTodoComments(file));
    findings.push(...detectCommentedOutCode(file));
    findings.push(...detectMixedModuleSystems(file));
    findings.push(...detectDeprecatedPatterns(file));
  }

  return findings;
}
