"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";
import { PLANS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-40 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 rpg-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 dungeon-gradient pointer-events-none" />
        <div className="scanline" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-magenta/30" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-magenta">
                Pricing
              </span>
              <div className="h-px w-8 bg-magenta/30" />
            </div>
            <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground max-w-2xl mx-auto">
              VibeCheck is free while in beta. No credit card required.
            </p>
          </div>

          <motion.div
            className="max-w-sm mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Free */}
            <motion.div variants={fadeUp} className="group relative">
              <div className="absolute -inset-1 bg-magenta/20 blur-sm group-hover:bg-magenta/40 transition-all opacity-0 group-hover:opacity-100" />
              <div className="rpg-panel p-10 flex flex-col bg-indigo-950/40 border-magenta/20 group-hover:border-magenta/50 transition-all">
                <div className="mb-8">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-magenta mb-4">
                    {PLANS.free.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="stat-value text-6xl text-cyan">
                      ${PLANS.free.price}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-4">
                    Perfect for trying out VibeCheck
                  </p>
                </div>

                <div className="h-px w-full bg-indigo-900/30 mb-8" />

                <ul className="space-y-4 mb-10 flex-1">
                  {PLANS.free.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="shrink-0 size-1.5 bg-magenta rotate-45 mt-1.5" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-foreground leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/audit" className="w-full">
                  <button className="rpg-button rpg-button-primary w-full py-4 text-xs font-bold">
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <p className="text-center font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 mt-12">
            More plans coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
