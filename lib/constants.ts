export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    auditsPerMonth: 3,
    maxFiles: 500,
    features: [
      "3 audits per month",
      "Up to 500 files",
      "7 category analysis",
      "Shareable reports",
    ],
  },
  pro: {
    name: "Pro",
    price: 19,
    auditsPerMonth: Infinity,
    maxFiles: 2000,
    features: [
      "Unlimited audits",
      "Up to 2,000 files",
      "7 category analysis",
      "Shareable reports",
      "Priority analysis",
      "Fix prompt export",
    ],
  },
  team: {
    name: "Team",
    price: 49,
    auditsPerMonth: Infinity,
    maxFiles: 2000,
    features: [
      "Everything in Pro",
      "Team dashboard",
      "Up to 2,000 files",
      "Priority support",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;

export const ANALYSIS_CATEGORIES = [
  "security",
  "architecture",
  "maintainability",
  "error-handling",
  "scalability",
  "tech-debt",
  "prompt-architecture",
] as const;

export type AnalysisCategory = (typeof ANALYSIS_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<AnalysisCategory, string> = {
  security: "Security",
  architecture: "Architecture",
  maintainability: "Maintainability",
  "error-handling": "Error Handling",
  scalability: "Scalability",
  "tech-debt": "Tech Debt",
  "prompt-architecture": "Prompt Architecture",
};

export const CATEGORY_WEIGHTS: Record<AnalysisCategory, number> = {
  security: 0.25,
  architecture: 0.15,
  maintainability: 0.15,
  "error-handling": 0.15,
  scalability: 0.1,
  "tech-debt": 0.1,
  "prompt-architecture": 0.1,
};

export const SEVERITY_DEDUCTIONS = {
  critical: 15,
  warning: 5,
  info: 1,
} as const;

export type Severity = keyof typeof SEVERITY_DEDUCTIONS;

export const GRADE_THRESHOLDS = [
  { min: 90, grade: "A" as const },
  { min: 80, grade: "B" as const },
  { min: 70, grade: "C" as const },
  { min: 60, grade: "D" as const },
  { min: 0, grade: "F" as const },
];

export type Grade = "A" | "B" | "C" | "D" | "F";

export const IGNORED_DIRS = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".vercel",
  ".turbo",
  "coverage",
  "__pycache__",
  ".venv",
  "vendor",
];

export const IGNORED_EXTENSIONS = [
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp",
  ".woff", ".woff2", ".ttf", ".eot", ".otf",
  ".mp3", ".mp4", ".avi", ".mov",
  ".zip", ".tar", ".gz",
  ".pdf", ".doc", ".docx",
  ".lock",
];

export const MAX_FILE_SIZE = 100_000; // 100KB
