"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <CheckCircle className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="text-sm text-muted-foreground font-medium">VibeCheck</p>
      </div>
    </div>
  );
}
