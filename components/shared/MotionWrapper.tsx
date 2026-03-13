"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

export const MotionDiv = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(function MotionDiv(props, ref) {
  return <motion.div ref={ref} {...props} />;
});

export const MotionSection = forwardRef<
  HTMLElement,
  HTMLMotionProps<"section">
>(function MotionSection(props, ref) {
  return <motion.section ref={ref} {...props} />;
});
