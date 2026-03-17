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
    <section className="relative pt-40 pb-32 px-4 overflow-hidden min-h-screen flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 rpg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 dungeon-gradient pointer-events-none" />
      <div className="scanline" />

      {/* Atmospheric Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-magenta/10 rounded-full blur-[100px] pointer-events-none animate-glow-pulse" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Left: Copy + CTA */}
        <motion.div
          className="flex flex-col gap-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.1] uppercase glow-text-magenta">
              Ship your Vibecoded app <br />
              <span className="text-cyan glow-text-cyan">with confidence.</span>
            </h1>
          </motion.div>

          <motion.div variants={fadeUp}>
            <p className="font-mono text-xs md:text-sm text-muted-foreground leading-relaxed max-w-lg uppercase tracking-wider">
              Get a plain-English audit of your Vibecoded codebase in 60
              seconds. Scored across 7 categories with copy-paste fix prompts.
            </p>
          </motion.div>

          {/* URL input + CTA */}
          <motion.div variants={fadeUp} className="relative group">
            <form
              onSubmit={handleSubmit}
              className="relative flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-indigo-400" />
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/user/repo"
                  className="rpg-input !pl-12 !h-14"
                />
              </div>
              <button
                type="submit"
                className="rpg-button rpg-button-primary h-14 px-8 text-sm font-bold flex items-center justify-center gap-3 shrink-0"
              >
                Run Free Audit
                <ArrowRight className="size-4" />
              </button>
            </form>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="stat-value text-xl">60s</span>
              <span className="stat-label">TIME TO AUDIT</span>
            </div>
            <div className="w-px h-8 bg-indigo-900/50" />
            <div className="flex flex-col">
              <span className="stat-value text-xl">100%</span>
              <span className="stat-label">ANONYMOUS</span>
            </div>
            <div className="w-px h-8 bg-indigo-900/50" />
            <div className="flex flex-col">
              <span className="stat-value text-xl">0G</span>
              <span className="stat-label">FREE START</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Terminal mockup + Score */}
        <motion.div
          className="flex flex-col gap-8 justify-center lg:justify-end relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Terminal mockup */}
          <div className="terminal-frame shadow-2xl">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-red-500/70" />
                <div className="size-2.5 rounded-full bg-yellow-500/70" />
                <div className="size-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2">vibecheck-audit.ts</span>
              </div>
              <div className="flex gap-1.5">
                <div className="size-2 bg-indigo-900" />
                <div className="size-2 bg-indigo-900" />
              </div>
            </div>

            {/* Terminal body */}
            <div
              className="terminal-body min-h-[320px]"
              style={{ fontVariantLigatures: "none" }}
            >
              {terminalLines.slice(0, visibleLines).map((line, i) => (
                <div
                  key={i}
                  style={{ paddingLeft: `${line.indent * 20}px` }}
                  className="mb-1"
                >
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
              {visibleLines < terminalLines.length && (
                <span className="inline-block w-2 h-4 bg-magenta animate-pulse ml-1 align-middle" />
              )}
            </div>
          </div>

          {/* Score card (Quest item style) */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Security", score: 45, color: "text-red-400" },
              { label: "Maintainability", score: 82, color: "text-green-400" },
              { label: "Scalability", score: 91, color: "text-green-400" },
            ].map((item) => (
              <div
                key={item.label}
                className="rpg-panel p-4 flex flex-col items-center gap-1 bg-indigo-950/40"
              >
                <span className={`text-xl font-bold font-mono ${item.color}`}>
                  {item.score}%
                </span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
