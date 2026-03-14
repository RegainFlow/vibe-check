"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";
import { PLANS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Simple, <span className="gradient-text">transparent</span> pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
            <motion.div variants={fadeUp} className="glow-card p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{PLANS.free.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${PLANS.free.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Perfect for trying out VibeCheck
                </p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {PLANS.free.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="/audit" className="w-full">
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </a>
            </motion.div>
          </motion.div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            More plans coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
