import type { AnalyzerModule } from "@/lib/analysis/types";
import * as security from "./security";
import * as architecture from "./architecture";
import * as maintainability from "./maintainability";
import * as errorHandling from "./error-handling";
import * as scalability from "./scalability";
import * as techDebt from "./tech-debt";
import * as promptArchitecture from "./prompt-architecture";

export const analyzers: AnalyzerModule[] = [
  { name: "security", analyze: security.analyze },
  { name: "architecture", analyze: architecture.analyze },
  { name: "maintainability", analyze: maintainability.analyze },
  { name: "error-handling", analyze: errorHandling.analyze },
  { name: "scalability", analyze: scalability.analyze },
  { name: "tech-debt", analyze: techDebt.analyze },
  { name: "prompt-architecture", analyze: promptArchitecture.analyze },
];
