"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { scaleIn } from "@/lib/motion";

export default function CTABanner() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 rpg-grid opacity-10 pointer-events-none" />
      
      <motion.div
        className="max-w-5xl mx-auto relative group"
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="absolute -inset-1 bg-magenta/20 blur-md group-hover:bg-magenta/40 transition-all opacity-0 group-hover:opacity-100" />
        
        <div className="rpg-panel p-12 md:p-20 relative overflow-hidden bg-indigo-950/40 text-center flex flex-col items-center gap-8">
          {/* Decorative Corner */}
          <div className="absolute top-0 left-0 size-20 border-t-2 border-l-2 border-magenta/20" />
          <div className="absolute bottom-0 right-0 size-20 border-b-2 border-r-2 border-magenta/20" />
          
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-8 bg-magenta/30" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-magenta">Get Started</span>
            <div className="h-px w-8 bg-magenta/30" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tighter text-foreground uppercase glow-text-magenta leading-[1.1]">
            Ready to check <br />
            <span className="text-cyan glow-text-cyan tracking-tight">your vibe?</span>
          </h2>
          
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground max-w-xl leading-relaxed">
            Get a plain-English audit of your AI-built codebase in 60 seconds.
            No credit card required.
          </p>
          
          <Link href="/audit" className="mt-4">
            <button className="rpg-button rpg-button-primary h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg font-bold flex items-center gap-4 group/btn whitespace-nowrap">
              Start Free Audit
              <ArrowRight className="size-6 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </Link>
          
          <div className="flex items-center gap-4 mt-4 opacity-50">
            <span className="font-mono text-[9px] uppercase tracking-widest">Free for public repos</span>
            <div className="size-1 bg-indigo-900 rotate-45" />
            <span className="font-mono text-[9px] uppercase tracking-widest">60 second scan</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
