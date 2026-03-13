"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { scaleIn } from "@/lib/motion";

export default function CTABanner() {
  return (
    <section className="py-24 px-4">
      <motion.div
        className="max-w-5xl mx-auto relative overflow-hidden rounded-2xl gradient-purple p-12 md:p-16"
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Ready to check your vibe?
          </h2>
          <p className="text-lg text-white/70 max-w-xl">
            Get a plain-English audit of your AI-built codebase in 60 seconds.
            No credit card required.
          </p>
          <Link href="/audit">
            <Button className="h-12 px-8 text-base font-semibold bg-white text-primary hover:bg-white/90 transition-colors gap-2">
              Start Free Audit
              <ArrowRight className="size-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
