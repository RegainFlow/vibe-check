"use client";

import { GitBranch, Search, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

const steps = [
  {
    number: "01",
    title: "Paste your repo",
    description:
      "Drop in your GitHub URL. We clone it, scan every file, and map the full dependency tree.",
    icon: GitBranch,
  },
  {
    number: "02",
    title: "Get your audit",
    description:
      "Our AI engine scores your codebase across 7 categories: security, structure, error handling, types, performance, dependencies, and docs.",
    icon: Search,
  },
  {
    number: "03",
    title: "Fix what matters",
    description:
      "Each finding comes with a severity level and a copy-paste prompt you can feed right back into your AI coding tool.",
    icon: Wrench,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-4 relative overflow-hidden">
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
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-magenta">The Process</span>
            <div className="h-px w-8 bg-magenta/30" />
          </div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tighter text-foreground uppercase glow-text-magenta">
            How it works
          </h2>
          <p className="mt-6 font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground max-w-2xl mx-auto">
            Three steps from repo URL to actionable fixes.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Animated connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[100px] left-0 w-full h-px bg-indigo-900/30 pointer-events-none" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="rpg-panel p-8 h-full flex flex-col gap-6 hover:border-magenta/40 transition-all bg-indigo-950/20">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-magenta/60 font-bold">
                    STEP {step.number}
                  </span>
                  <div className="size-2 bg-indigo-900 rotate-45" />
                </div>

                <div className="relative">
                  <div className="size-16 flex items-center justify-center bg-indigo-950 border-2 border-indigo-900 group-hover:border-magenta group-hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all">
                    <step.icon className="size-7 text-magenta" />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-mono text-lg font-bold text-foreground uppercase tracking-tight group-hover:text-magenta transition-colors">
                    {step.title}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                <div className="mt-auto pt-4 flex justify-end">
                  <div className="size-1.5 bg-indigo-900 rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
