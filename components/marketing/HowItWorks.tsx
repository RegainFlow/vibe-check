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
    <section id="how-it-works" className="py-24 px-4 section-glow">
      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Three steps from repo URL to actionable fixes.
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 relative"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Animated connecting line (desktop only) */}
          <motion.div
            className="hidden md:block absolute top-[72px] left-[calc(33.333%-12px)] w-[calc(33.333%+24px)] h-0.5 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 pointer-events-none origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              className="group relative glow-card p-8"
            >
              {/* Step number watermark */}
              <span className="text-5xl font-bold text-foreground/[0.03] absolute top-4 right-6 select-none">
                {step.number}
              </span>

              <div className="relative flex flex-col gap-4">
                {/* Icon in gradient circle */}
                <div className="relative">
                  <motion.div
                    className="w-14 h-14 rounded-2xl gradient-purple flex items-center justify-center shadow-lg shadow-primary/20"
                    whileHover={{ rotate: 12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <step.icon className="size-6 text-white" />
                  </motion.div>
                  {/* Connector dot */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-2 h-2 rounded-full bg-primary/40 -translate-y-1/2 translate-x-full" />
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
