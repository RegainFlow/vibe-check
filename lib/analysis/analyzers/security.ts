import type { FileEntry, RawFinding } from "@/lib/analysis/types";

const CODE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php"];

const SECRET_PATTERNS: { regex: RegExp; id: string; title: string }[] = [
  { regex: /sk-[a-zA-Z0-9]{20,}/, id: "hardcoded-openai-key", title: "Hardcoded OpenAI API key" },
  { regex: /sk_live_[a-zA-Z0-9]{20,}/, id: "hardcoded-stripe-live-key", title: "Hardcoded Stripe live key" },
  { regex: /sk_test_[a-zA-Z0-9]{20,}/, id: "hardcoded-stripe-test-key", title: "Hardcoded Stripe test key" },
  { regex: /AKIA[0-9A-Z]{16}/, id: "hardcoded-aws-key", title: "Hardcoded AWS access key" },
  { regex: /ghp_[a-zA-Z0-9]{36,}/, id: "hardcoded-github-token", title: "Hardcoded GitHub personal access token" },
  { regex: /glpat-[a-zA-Z0-9\-_]{20,}/, id: "hardcoded-gitlab-token", title: "Hardcoded GitLab personal access token" },
  { regex: /xox[bpas]-[a-zA-Z0-9\-]{10,}/, id: "hardcoded-slack-token", title: "Hardcoded Slack token" },
  { regex: /-----BEGIN\s+(RSA|EC|DSA|OPENSSH)?\s*PRIVATE\sKEY-----/, id: "hardcoded-private-key", title: "Hardcoded private key" },
  { regex: /(?:password|passwd|pwd)\s*=\s*["'][^"']+["']/, id: "hardcoded-password", title: "Hardcoded password in source" },
  { regex: /(?:api_key|apikey|api_secret|secret_key)\s*=\s*["'][^"']+["']/, id: "hardcoded-api-secret", title: "Hardcoded API secret" },
];

function isCodeFile(ext: string): boolean {
  return CODE_EXTENSIONS.includes(ext);
}

function detectSecrets(file: FileEntry): RawFinding[] {
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip comments and test fixtures
    const trimmed = line.trim();
    if (trimmed.startsWith("//") && trimmed.includes("example")) continue;
    if (trimmed.startsWith("#") && trimmed.includes("example")) continue;

    for (const pattern of SECRET_PATTERNS) {
      if (pattern.regex.test(line)) {
        findings.push({
          category: "security",
          severity: "critical",
          patternId: pattern.id,
          title: pattern.title,
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: line.trim().substring(0, 120),
          context: `Found in ${file.relativePath}`,
        });
      }
    }
  }

  return findings;
}

function detectEvalAndInnerHTML(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comment lines
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;

    if (/\beval\s*\(/.test(line)) {
      findings.push({
        category: "security",
        severity: "critical",
        patternId: "eval-usage",
        title: "Use of eval() detected",
        filePath: file.relativePath,
        lineStart: i + 1,
        codeSnippet: trimmed.substring(0, 120),
        context: "eval() can execute arbitrary code and is a security risk",
      });
    }

    if (/\.innerHTML\s*=/.test(line) || /dangerouslySetInnerHTML/.test(line)) {
      findings.push({
        category: "security",
        severity: "warning",
        patternId: "innerhtml-usage",
        title: "Direct innerHTML / dangerouslySetInnerHTML usage",
        filePath: file.relativePath,
        lineStart: i + 1,
        codeSnippet: trimmed.substring(0, 120),
        context: "Unsafe HTML insertion can lead to XSS attacks",
      });
    }
  }

  return findings;
}

function detectSQLInjection(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  const sqlInjectionPatterns = [
    /(?:query|execute|raw)\s*\(\s*`[^`]*\$\{/,
    /(?:query|execute|raw)\s*\(\s*["'][^"']*["']\s*\+/,
    /(?:query|execute|raw)\s*\(\s*['"](?:SELECT|INSERT|UPDATE|DELETE|DROP)/i,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;

    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(line)) {
        findings.push({
          category: "security",
          severity: "critical",
          patternId: "sql-injection",
          title: "Potential SQL injection via string concatenation",
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: trimmed.substring(0, 120),
          context: "Use parameterized queries instead of string concatenation",
        });
        break;
      }
    }
  }

  return findings;
}

function detectExposedEnvFiles(file: FileEntry): RawFinding[] {
  const findings: RawFinding[] = [];
  const basename = file.relativePath.split("/").pop() || "";

  if (basename === ".env" || basename === ".env.local" || basename === ".env.production") {
    findings.push({
      category: "security",
      severity: "critical",
      patternId: "exposed-env-file",
      title: "Environment file with potential secrets committed to repo",
      filePath: file.relativePath,
      lineStart: 1,
      context: `${basename} should be in .gitignore and never committed`,
    });
  }

  // Config files with embedded secrets
  if (/config/i.test(basename) && isCodeFile(file.extension)) {
    const lines = file.content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/(?:password|secret|api_key|token)\s*[:=]\s*["'][^"']{8,}["']/i.test(line)) {
        const trimmed = line.trim();
        if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
        // Skip process.env references
        if (/process\.env/.test(line)) continue;

        findings.push({
          category: "security",
          severity: "critical",
          patternId: "config-secret",
          title: "Secret value in configuration file",
          filePath: file.relativePath,
          lineStart: i + 1,
          codeSnippet: trimmed.substring(0, 120),
          context: "Secrets should come from environment variables, not config files",
        });
      }
    }
  }

  return findings;
}

function detectInsecureHTTP(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  const findings: RawFinding[] = [];
  const lines = file.content.split("\n");

  const httpPattern = /(?:fetch|axios\.(?:get|post|put|patch|delete)|http\.request)\s*\(\s*["'`]http:\/\//;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
    // Skip localhost/127.0.0.1 for development
    if (/http:\/\/(?:localhost|127\.0\.0\.1)/.test(line)) continue;

    if (httpPattern.test(line)) {
      findings.push({
        category: "security",
        severity: "warning",
        patternId: "insecure-http",
        title: "Insecure HTTP URL in network request",
        filePath: file.relativePath,
        lineStart: i + 1,
        codeSnippet: trimmed.substring(0, 120),
        context: "Use HTTPS to prevent man-in-the-middle attacks",
      });
    }
  }

  return findings;
}

export function analyze(files: FileEntry[]): RawFinding[] {
  const findings: RawFinding[] = [];

  for (const file of files) {
    findings.push(...detectSecrets(file));
    findings.push(...detectEvalAndInnerHTML(file));
    findings.push(...detectSQLInjection(file));
    findings.push(...detectExposedEnvFiles(file));
    findings.push(...detectInsecureHTTP(file));
  }

  return findings;
}
