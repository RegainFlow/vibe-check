"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: { width: 96, stroke: 6, gradeSize: "text-xl", scoreSize: "text-xs", labelSize: "text-[10px]" },
  md: { width: 144, stroke: 8, gradeSize: "text-3xl", scoreSize: "text-sm", labelSize: "text-xs" },
  lg: { width: 192, stroke: 10, gradeSize: "text-4xl", scoreSize: "text-base", labelSize: "text-sm" },
};

function getGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function getGradientColors(score: number): { start: string; end: string; glow: string } {
  if (score > 80)
    return { start: "#22C55E", end: "#14B8A6", glow: "rgba(34,197,94,0.3)" };
  if (score >= 60)
    return { start: "#F59E0B", end: "#EAB308", glow: "rgba(245,158,11,0.3)" };
  return { start: "#EF4444", end: "#F97316", glow: "rgba(239,68,68,0.3)" };
}

export default function ScoreGauge({ score, label, size = "md" }: ScoreGaugeProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = getGradientColors(score);
  const grade = getGrade(score);
  const center = config.width / 2;
  const gradientId = `score-gradient-${score}-${size}`;

  // Spring-animated stroke offset: starts at full circumference (empty), animates to target offset
  const dashMotion = useMotionValue(circumference);
  const dashSpring = useSpring(dashMotion, { stiffness: 50, damping: 20 });

  // Spring-animated count-up number: starts at 0, animates to score
  const scoreMotion = useMotionValue(0);
  const scoreSpring = useSpring(scoreMotion, { stiffness: 50, damping: 20 });
  const displayScore = useTransform(scoreSpring, (v) => Math.round(v));

  // Glow opacity driven by how far the arc has progressed
  const glowOpacity = useTransform(dashSpring, [circumference, offset], [0, 1]);

  useEffect(() => {
    // Small delay to let the component mount before animating
    const timer = setTimeout(() => {
      dashMotion.set(offset);
      scoreMotion.set(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [dashMotion, scoreMotion, offset, score]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        {/* Glow behind gauge */}
        <motion.div
          className="absolute inset-0 rounded-full blur-[20px] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
            opacity: glowOpacity,
          }}
        />
        <svg
          width={config.width}
          height={config.width}
          viewBox={`0 0 ${config.width} ${config.width}`}
          className="-rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-white/5"
          />
          {/* Score arc with gradient stroke */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: dashSpring,
              filter: `drop-shadow(0 0 8px ${colors.glow})`,
            }}
          />
        </svg>
        {/* Center content with pop animation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("font-bold leading-none", config.gradeSize)}
            style={{ color: colors.start }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
          >
            {grade}
          </motion.span>
          <motion.span className={cn("font-mono text-muted-foreground mt-0.5", config.scoreSize)}>
            {displayScore}
          </motion.span>
        </div>
      </div>
      {label && (
        <span className={cn("text-muted-foreground font-medium", config.labelSize)}>
          {label}
        </span>
      )}
    </div>
  );
}
