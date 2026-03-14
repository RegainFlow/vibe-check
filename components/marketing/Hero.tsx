"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Github, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ScoreGauge from "@/components/audit/ScoreGauge";
import { fadeUp, staggerContainer } from "@/lib/motion";

const terminalLines = [
  {
    indent: 0,
    parts: [
      { text: "const ", color: "text-purple-400" },
      { text: "audit", color: "text-blue-300" },
      { text: " = ", color: "text-white/60" },
      { text: "await ", color: "text-purple-400" },
      { text: "vibeCheck", color: "text-green-400" },
      { text: "(repo);", color: "text-white/60" },
    ],
  },
  { indent: 0, parts: [{ text: "", color: "" }] },
  {
    indent: 0,
    parts: [
      { text: "// ", color: "text-white/30" },
      { text: "Scanning 247 files...", color: "text-white/30" },
    ],
  },
  {
    indent: 0,
    parts: [
      { text: "console", color: "text-blue-300" },
      { text: ".log", color: "text-yellow-300" },
      { text: "(audit.", color: "text-white/60" },
      { text: "score", color: "text-green-400" },
      { text: ");", color: "text-white/60" },
    ],
  },
  {
    indent: 0,
    parts: [
      { text: "// => ", color: "text-white/30" },
      { text: "72", color: "text-amber-400" },
      { text: " (Grade: C)", color: "text-white/30" },
    ],
  },
  { indent: 0, parts: [{ text: "", color: "" }] },
  {
    indent: 0,
    parts: [
      { text: "audit", color: "text-blue-300" },
      { text: ".findings", color: "text-white/60" },
      { text: ".forEach", color: "text-yellow-300" },
      { text: "((f) => {", color: "text-white/60" },
    ],
  },
  {
    indent: 1,
    parts: [
      { text: "if ", color: "text-purple-400" },
      { text: "(f.severity === ", color: "text-white/60" },
      { text: "'critical'", color: "text-red-400" },
      { text: ")", color: "text-white/60" },
    ],
  },
  {
    indent: 2,
    parts: [
      { text: "fix", color: "text-green-400" },
      { text: "(f.prompt);", color: "text-white/60" },
    ],
  },
  { indent: 0, parts: [{ text: "});", color: "text-white/60" }] },
];

export default function Hero() {
  const [url, setUrl] = useState("");
  const [visibleLines, setVisibleLines] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= terminalLines.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a GitHub repository URL");
      inputRef.current?.focus();
      return;
    }
    router.push(`/audit?url=${encodeURIComponent(url.trim())}`);
  }

  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Floating dots */}
      <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-primary/40 animate-float" />
      <div
        className="absolute top-40 right-[20%] w-1.5 h-1.5 rounded-full bg-accent/40 animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-32 left-[25%] w-1 h-1 rounded-full bg-gradient-end/40 animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy + CTA */}
        <motion.div
          className="flex flex-col gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Ship your AI-built app{" "}
              <span className="gradient-text">with confidence.</span>
            </h1>
          </motion.div>
          <motion.div variants={fadeUp}>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Get a plain-English audit of your AI-built codebase in 60 seconds.
              Scored across 7 categories with copy-paste fix prompts.
            </p>
          </motion.div>

          {/* URL input + CTA */}
          <motion.div variants={fadeUp}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg"
            >
              <div className="relative flex-1">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/user/repo"
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-card/50 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all"
                />
              </div>
              <Button
                type="submit"
                className="h-11 px-6 text-sm font-semibold gradient-purple hover:opacity-90 transition-opacity gap-2 border-0"
              >
                Run Free Audit
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </motion.div>

          <motion.div variants={fadeUp}>
            <p className="text-xs text-muted-foreground">
              No credit card required. Public repos only for free tier.
            </p>
          </motion.div>
        </motion.div>

        {/* Right: Terminal mockup + Score */}
        <motion.div
          className="flex flex-col gap-6 justify-center lg:justify-end"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Terminal mockup */}
          <div className="terminal-card relative">
            <div className="absolute inset-0 bg-primary/5 rounded-xl blur-[60px] scale-110 pointer-events-none" />
            <div className="relative">
              {/* Terminal header */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">
                  vibecheck-audit.ts
                </span>
              </div>
              {/* Terminal body */}
              <div className="p-4 font-mono text-sm leading-relaxed" style={{ fontVariantLigatures: "none" }}>
                {terminalLines.slice(0, visibleLines).map((line, i) => (
                  <div key={i} style={{ paddingLeft: `${line.indent * 20}px` }}>
                    {line.parts.map((part, j) => (
                      <span key={j} className={part.color}>
                        {part.text}
                      </span>
                    ))}
                    {line.parts.length === 1 && line.parts[0].text === "" && (
                      <br />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Score card (smaller, below terminal) */}
          <div className="flex justify-center">
            <div className="glow-card p-6 flex items-center gap-6">
              <ScoreGauge score={72} label="Overall" size="sm" />
              <div className="flex gap-3">
                {[
                  { label: "Security", score: 45 },
                  { label: "Structure", score: 82 },
                  { label: "Types", score: 91 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-1 rounded-lg border border-white/5 bg-background/50 p-2"
                  >
                    <ScoreGauge score={item.score} size="sm" />
                    <span className="text-[10px] text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
