import Navbar from "@/components/shared/Navbar";

export const metadata = {
  title: "About — VibeCheck",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-40 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 rpg-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 dungeon-gradient pointer-events-none" />
        <div className="scanline" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Page header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-magenta/30" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-magenta">
                About
              </span>
              <div className="h-px w-8 bg-magenta/30" />
            </div>
            <h1 className="text-3xl md:text-5xl font-mono font-bold tracking-tighter text-foreground uppercase glow-text-magenta leading-[1.1]">
              About VibeCheck
            </h1>
            <p className="mt-6 font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground max-w-2xl mx-auto">
              Automated code auditing for the age of AI-generated code.
            </p>
          </div>

          {/* Content sections */}
          <div className="grid gap-8">
            {/* What is VibeCheck */}
            <div className="rpg-panel p-8 md:p-10 bg-indigo-950/20">
              <h2 className="font-mono text-lg font-bold text-foreground uppercase tracking-tight mb-4">
                What is VibeCheck
              </h2>
              <div className="h-px w-full bg-gradient-to-r from-magenta/30 to-transparent mb-6" />
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground leading-relaxed">
                VibeCheck is an automated code auditing tool built for the age of
                AI-generated code. Paste a GitHub URL, and in about 60 seconds
                you&apos;ll get a plain-English report covering security, performance,
                code quality, and more &mdash; complete with copy-paste fix prompts you
                can feed right back to your AI coding tool.
              </p>
            </div>

            {/* Why it exists */}
            <div className="rpg-panel p-8 md:p-10 bg-indigo-950/20">
              <h2 className="font-mono text-lg font-bold text-foreground uppercase tracking-tight mb-4">
                Why it exists
              </h2>
              <div className="h-px w-full bg-gradient-to-r from-magenta/30 to-transparent mb-6" />
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground leading-relaxed">
                Vibe-coded apps ship fast, but speed comes with trade-offs. AI
                assistants can introduce hidden security holes, performance
                bottlenecks, and maintainability issues that aren&apos;t obvious until
                something breaks in production. VibeCheck exists to catch those
                problems before your users do.
              </p>
            </div>

            {/* Who it's for */}
            <div className="rpg-panel p-8 md:p-10 bg-indigo-950/20">
              <h2 className="font-mono text-lg font-bold text-foreground uppercase tracking-tight mb-4">
                Who it&apos;s for
              </h2>
              <div className="h-px w-full bg-gradient-to-r from-magenta/30 to-transparent mb-6" />
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="shrink-0 size-1.5 bg-magenta rotate-45 mt-1.5" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground leading-relaxed">
                    Non-technical founders who need confidence that their codebase is ship-ready.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 size-1.5 bg-magenta rotate-45 mt-1.5" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground leading-relaxed">
                    Solo developers and indie hackers moving fast with AI-generated code.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 size-1.5 bg-magenta rotate-45 mt-1.5" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground leading-relaxed">
                    Small teams that want an extra set of eyes without hiring a full-time reviewer.
                  </span>
                </li>
              </ul>
            </div>

            {/* How it works */}
            <div className="rpg-panel p-8 md:p-10 bg-indigo-950/20">
              <h2 className="font-mono text-lg font-bold text-foreground uppercase tracking-tight mb-4">
                How it works
              </h2>
              <div className="h-px w-full bg-gradient-to-r from-magenta/30 to-transparent mb-6" />
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground leading-relaxed">
                Paste a public GitHub repository URL &rarr; VibeCheck clones the
                repo, runs seven parallel analyzers across your codebase, and
                generates a scored report in plain English. Every finding includes a
                severity rating, an explanation of why it matters, and a ready-to-use
                fix prompt. The whole process takes about 60 seconds.
              </p>
            </div>

            {/* Built by RegainFlow */}
            <div className="rpg-panel p-8 md:p-10 bg-indigo-950/20">
              <h2 className="font-mono text-lg font-bold text-foreground uppercase tracking-tight mb-4">
                Built by RegainFlow
              </h2>
              <div className="h-px w-full bg-gradient-to-r from-magenta/30 to-transparent mb-6" />
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground leading-relaxed">
                VibeCheck is built by{" "}
                <a href="https://regainflow.com" target="_blank" rel="noopener noreferrer" className="text-magenta hover:underline">
                  RegainFlow
                </a>
                {" "}&mdash; crafting tools that help founders ship with confidence.
                Questions or feedback? Reach out at{" "}
                <a href="mailto:leonardo.j.ramirez@regainflow.com" className="text-magenta hover:underline">
                  leonardo.j.ramirez@regainflow.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
