"use client";

import { useEffect, useRef } from "react";
import { ShieldAlert, Bug, Activity, FileCode, Users } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import type { PlatformStats } from "@/lib/platform-stats";

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 50, damping: 20 });
  const display = useTransform(
    spring,
    (v) => `${Math.round(v).toLocaleString()}${suffix}`
  );

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, motionValue, target]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

const researchStats = [
  {
    icon: ShieldAlert,
    stat: "82%",
    target: 82,
    suffix: "%",
    description: "of working AI-generated code has security flaws",
    source: "Carnegie Mellon University",
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
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
  },
];

const liveStatConfig = [
  { key: "totalAudits" as const, icon: Activity, label: "Audits Completed" },
  { key: "totalFindings" as const, icon: Bug, label: "Issues Found" },
  { key: "totalFilesScanned" as const, icon: FileCode, label: "Files Scanned" },
  { key: "distinctUsers" as const, icon: Users, label: "Vibecoders Trust Us" },
];

export default function SocialProof({ stats }: { stats: PlatformStats }) {
  const hasLiveStats = Object.values(stats).some((v) => v > 0);

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
              Why It Matters
            </span>
            <div className="h-px w-8 bg-magenta/30" />
          </div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tighter text-foreground uppercase glow-text-magenta leading-[1.1]">
            The Reality of{" "}
            <span className="text-cyan glow-text-cyan tracking-tight">
              Vibe-Coding
            </span>
          </h2>
          <p className="mt-6 font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground max-w-2xl mx-auto">
            Research-backed stats and live data from our platform.
          </p>
        </motion.div>

        {/* Research stats */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {researchStats.map((item) => (
            <motion.div key={item.stat} variants={fadeUp} className="group">
              <div className="rpg-panel p-8 flex items-start gap-6 hover:border-magenta/40 transition-all bg-indigo-950/20">
                <div className="shrink-0 p-4 bg-indigo-950 border border-indigo-900 rounded-lg group-hover:border-magenta/40 transition-all">
                  <item.icon
                    className={`size-8 ${item.iconColor} filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
                  />
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
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Live platform stats */}
        {hasLiveStats && (
          <>
            {/* Divider */}
            <div className="flex items-center gap-4 my-12">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-magenta/30 to-transparent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-magenta/60">
                Live Platform Data
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-magenta/30 to-transparent" />
            </div>

            {/* Live stats grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {liveStatConfig.map((item) => {
                const value = stats[item.key];
                if (value === 0) return null;
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.key}
                    variants={fadeUp}
                    className="group h-full"
                  >
                    <div className="rpg-panel p-6 flex flex-col items-center gap-3 text-center hover:border-magenta/40 transition-all bg-indigo-950/20">
                      <div className="shrink-0 size-10 flex items-center justify-center bg-indigo-950 border border-indigo-900 rounded-lg group-hover:border-magenta transition-all">
                        <Icon className="size-5 text-magenta" />
                      </div>
                      <p className="stat-value text-2xl md:text-3xl">
                        <CountUp target={value} suffix="" />
                      </p>
                      <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
