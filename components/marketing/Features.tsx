"use client";

import { Shield, Sparkles, BarChart3, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

const features = [
  {
    icon: Shield,
    title: "Security Analysis",
    description:
      "Detect SQL injection, XSS, and hardcoded secrets before they reach production.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Fix Prompts",
    description:
      "Every finding comes with a copy-paste prompt you can feed right back into your AI tool.",
  },
  {
    icon: BarChart3,
    title: "7 Category Scoring",
    description:
      "Scored across security, architecture, error handling, types, performance, deps, and docs.",
  },
  {
    icon: Share2,
    title: "Instant Share",
    description:
      "Generate a shareable link to send your audit report to co-founders, investors, or devs.",
  },
];

export default function Features() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 rpg-grid opacity-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="inline-flex items-center gap-3 mb-4 text-center">
            <div className="h-px w-8 bg-magenta/30" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-magenta">
              Capabilities
            </span>
            <div className="h-px w-8 bg-magenta/30" />
          </div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tighter text-foreground uppercase glow-text-magenta leading-[1.1]">
            Everything you need to <br />
            <span className="text-cyan glow-text-cyan tracking-tight">
              ship Confidently
            </span>
          </h2>
          <p className="mt-6 font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground max-w-2xl mx-auto">
            Comprehensive code analysis designed for non-technical founders.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="group"
              >
                <div className="rpg-panel p-8 h-full flex flex-col gap-6 hover:border-magenta/40 transition-all bg-indigo-950/20">
                  <div className="flex items-center gap-6">
                    <div className="shrink-0 size-14 flex items-center justify-center bg-indigo-950 border border-indigo-900 rounded-lg group-hover:border-magenta transition-all">
                      <Icon className="size-6 text-magenta" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-mono text-lg font-bold text-foreground uppercase tracking-tight group-hover:text-magenta transition-colors">
                        {feature.title}
                      </h3>
                      <div className="h-px w-full bg-gradient-to-r from-magenta/30 to-transparent" />
                    </div>
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between opacity-30">
                    <span className="font-mono text-[9px] uppercase tracking-tighter">
                      Module: {feature.title.split(" ")[0]}
                    </span>
                    <div className="flex gap-1">
                      <div className="size-1 bg-magenta" />
                      <div className="size-1 bg-magenta" />
                      <div className="size-1 bg-magenta" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
