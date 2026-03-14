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
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((item) => (
            <motion.div
              key={item.stat}
              variants={fadeUp}
              className={`glow-card border-l-4 ${item.borderColor} p-8 flex items-start gap-5`}
            >
              <div className={`shrink-0 rounded-xl ${item.iconBg} p-3`}>
                <item.icon className={`size-6 ${item.iconColor}`} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  <CountUp target={item.target} suffix={item.suffix} />
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <p className="text-xs text-muted-foreground/60 font-medium mt-1">
                  Source: {item.source}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
