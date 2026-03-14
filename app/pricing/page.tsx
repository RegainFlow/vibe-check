"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";
import { PLANS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(plan: "pro" | "team") {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(null);
    }
  }

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
              Start free. Upgrade when you need unlimited audits and deeper
              analysis.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
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

            {/* Pro — highlighted */}
            <motion.div variants={fadeUp} className="relative glow-card p-6 flex flex-col border-primary/40 shadow-[0_0_40px_rgba(124,58,237,0.15)]">
              {/* Animated border glow */}
              <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-primary/30 via-primary/10 to-transparent pointer-events-none animate-glow-pulse" style={{ zIndex: -1 }} />

              <motion.div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-purple text-white text-xs font-medium shadow-lg shadow-primary/30"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Most Popular
              </motion.div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{PLANS.pro.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${PLANS.pro.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  For founders shipping regularly
                </p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {PLANS.pro.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full gradient-purple border-0 text-white hover:opacity-90 transition-opacity"
                onClick={() => handleCheckout("pro")}
                disabled={loading === "pro"}
              >
                {loading === "pro" && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                Subscribe to Pro
              </Button>
            </motion.div>

            {/* Team */}
            <motion.div variants={fadeUp} className="glow-card p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{PLANS.team.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${PLANS.team.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  For teams with multiple projects
                </p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {PLANS.team.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleCheckout("team")}
                disabled={loading === "team"}
              >
                {loading === "team" && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                Subscribe to Team
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
