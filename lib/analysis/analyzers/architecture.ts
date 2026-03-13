import type { FileEntry, RawFinding } from "@/lib/analysis/types";

const CODE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php"];

const GOD_FILE_THRESHOLD = 300;

function isCodeFile(ext: string): boolean {
  return CODE_EXTENSIONS.includes(ext);
}

function detectGodFiles(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];
  if (file.lineCount <= GOD_FILE_THRESHOLD) return [];

  return [
    {
      category: "architecture",
      severity: "warning",
      patternId: "god-file",
      title: `File exceeds ${GOD_FILE_THRESHOLD} lines (${file.lineCount} lines)`,
      filePath: file.relativePath,
      lineStart: 1,
      lineEnd: file.lineCount,
      context: `Large files are harder to maintain. Consider splitting into smaller, focused modules.`,
    },
  ];
}

function detectMixedConcerns(file: FileEntry): RawFinding[] {
  if (!isCodeFile(file.extension)) return [];

  // Only check files that look like API routes or pages
  const isApiRoute =
    /[\\/]api[\\/]/.test(file.relativePath) ||
    /[\\/]routes?[\\/]/.test(file.relativePath);
  if (!isApiRoute) return [];

  const content = file.content;

  // Check for direct DB queries
  const hasDBQueries =
    /(?:prisma|mongoose|knex|sequelize|supabase)\s*\./.test(content) ||
    /(?:SELECT|INSERT|UPDATE|DELETE)\s+/i.test(content) ||
    /\.(?:findMany|findOne|findUnique|create|update|delete)\s*\(/.test(content);

  // Check for rendering / UI concerns in the same file
  const hasRendering =
    /(?:return\s*\(\s*<|React\.createElement|render\s*\()/.test(content) ||
    /(?:jsx|tsx)/.test(file.extension) && /<\w+[\s>]/.test(content);

  // Check for HTML response rendering mixed with DB
  const hasHTMLRendering =
    /res\.(?:render|send)\s*\(/.test(content) && hasDBQueries;

  if (hasDBQueries && (hasRendering || hasHTMLRendering)) {
    const findings: RawFinding[] = [];
    const lines = content.split("\n");

    // Find the first line with a DB query for reference
    let dbLine = 1;
    for (let i = 0; i < lines.length; i++) {
      if (/(?:prisma|mongoose|knex|sequelize|supabase|findMany|findOne|query)\s*[.(]/.test(lines[i])) {
        dbLine = i + 1;
        break;
      }
    }

    findings.push({
      category: "architecture",
      severity: "warning",
      patternId: "mixed-concerns",
      title: "API route mixes data access with rendering logic",
      filePath: file.relativePath,
      lineStart: dbLine,
      context:
        "Separate data access into service/repository layers and keep routes thin",
    });

    return findings;
  }

  return [];
}

function detectMissingErrorBoundaries(files: FileEntry[]): RawFinding[] {
  const findings: RawFinding[] = [];

  // Check if this looks like a React project
  const hasReactFiles = files.some(
    (f) => (f.extension === ".tsx" || f.extension === ".jsx") && /<\w+/.test(f.content)
  );
  if (!hasReactFiles) return [];

  // Check for error boundary presence
  const hasErrorBoundary = files.some(
    (f) =>
      /error[-_]?boundary/i.test(f.relativePath) ||
      /componentDidCatch|getDerivedStateFromError/.test(f.content) ||
      /ErrorBoundary/.test(f.content)
  );

  // In Next.js, error.tsx/error.js files serve as error boundaries
  const hasNextErrorPage = files.some(
    (f) => /[\\/]error\.(tsx|jsx|ts|js)$/.test(f.relativePath)
  );

  if (!hasErrorBoundary && !hasNextErrorPage) {
    // Find the layout or main app file for reference
    const layoutFile = files.find(
      (f) =>
        /layout\.(tsx|jsx)$/.test(f.relativePath) ||
        /App\.(tsx|jsx)$/.test(f.relativePath) ||
        /_app\.(tsx|jsx)$/.test(f.relativePath)
    );

    findings.push({
      category: "architecture",
      severity: "warning",
      patternId: "missing-error-boundary",
      title: "No React error boundary detected in the application",
      filePath: layoutFile?.relativePath || "app/layout.tsx",
      lineStart: 1,
      context:
        "Error boundaries catch rendering errors and prevent the entire app from crashing. Add an error.tsx file or ErrorBoundary component.",
    });
  }

  return findings;
}

export function analyze(files: FileEntry[]): RawFinding[] {
  const findings: RawFinding[] = [];

  for (const file of files) {
    findings.push(...detectGodFiles(file));
    findings.push(...detectMixedConcerns(file));
  }

  findings.push(...detectMissingErrorBoundaries(files));

  return findings;
}
