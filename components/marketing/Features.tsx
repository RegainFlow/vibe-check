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
    <section className="py-24 px-4 section-glow">
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
            Everything you need to{" "}
            <span className="gradient-text">ship safely</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive code analysis designed for non-technical founders.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={fadeUp} className="glow-card p-8">
                <div className="flex items-start gap-5">
                  <motion.div
                    className="shrink-0 w-12 h-12 rounded-xl gradient-purple flex items-center justify-center"
                    whileHover={{ rotate: 12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Icon className="size-6 text-white" />
                  </motion.div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-foreground tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
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
