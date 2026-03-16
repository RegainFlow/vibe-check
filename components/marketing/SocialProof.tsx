"use client";

import { useEffect, useRef } from "react";
import { ShieldAlert, Bug } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => {
    const rounded = Math.round(v);
    return rounded >= 1000
      ? `${(rounded / 1000).toFixed(0)},${String(rounded % 1000).padStart(3, "0")}${suffix}`
      : `${rounded}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, motionValue, target]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

const stats = [
  {
    icon: ShieldAlert,
    stat: "82%",
    target: 82,
    suffix: "%",
    description: "of working AI-generated code has security flaws",
    source: "Carnegie Mellon University",
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
    borderColor: "border-l-red-500/50",
  },
  {
    icon: Bug,
    stat: "2,000+",
    target: 2000,
    suffix: "+",
    description: "vulnerabilities found in vibe-coded apps",
    source: "Escape.tech",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    borderColor: "border-l-amber-500/50",
  },
];

export default function SocialProof() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12 text-center">
          <div className="h-px w-24 bg-indigo-900/50" />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-magenta/60">The Reality of Vibe-Coding</h2>
          <div className="h-px w-24 bg-indigo-900/50" />
        </div>
        
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((item) => (
            <motion.div
              key={item.stat}
              variants={fadeUp}
              className="rpg-panel p-8 flex items-start gap-6 group hover:border-magenta/40 transition-all"
            >
              <div className="shrink-0 p-4 bg-indigo-950/50 border border-indigo-900 group-hover:border-magenta/40 transition-all">
                <item.icon className={`size-8 ${item.iconColor} filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
              </div>
              <div className="flex flex-col gap-3">
                <p className="stat-value text-4xl md:text-5xl">
                  <CountUp target={item.target} suffix={item.suffix} />
                </p>
                <p className="font-mono text-xs uppercase tracking-widest text-foreground leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="size-1 bg-indigo-900" />
                  <p className="font-mono text-[10px] uppercase tracking-tighter text-muted-foreground">
                    Source: {item.source}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
