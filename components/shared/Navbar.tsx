"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import AuthButton from "@/components/shared/AuthButton";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const howItWorksHref = pathname === "/" ? "#how-it-works" : "/#how-it-works";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-md border-b border-indigo-900/30 w-full">
      <div className="w-full px-4 sm:px-8 h-16 flex items-center justify-between relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group relative z-10">
          <div className="size-8 flex items-center justify-center bg-indigo-950 border border-magenta/40 rounded-sm rotate-45 group-hover:border-magenta group-hover:shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all">
            <CheckCircle className="size-5 text-magenta -rotate-45" />
          </div>
          <span className="text-xl font-mono font-bold tracking-tighter text-foreground uppercase glow-text-magenta">
            VibeCheck
          </span>
        </Link>

        {/* Right side group */}
        <div className="flex items-center gap-4 relative z-10">
          {/* Nav links (desktop) */}
          <div className="hidden sm:flex items-center gap-6 mr-2">
            <Link
              href={howItWorksHref}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-magenta transition-colors relative py-1"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-magenta transition-colors relative py-1"
            >
              Pricing
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-4 border-l border-indigo-900/50 pl-4">
            <ThemeToggle />
            <AuthButton />
            <Link href="/audit">
              <button className="rpg-button rpg-button-primary text-xs font-bold py-1.5 px-6 h-auto">
                Start Free Audit
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden size-9 flex items-center justify-center border border-indigo-900/50 bg-indigo-950/50 hover:border-magenta/50 transition-colors rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="size-5 text-magenta" />
            ) : (
              <Menu className="size-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-xl sm:hidden border-t border-indigo-900/50"
          >
            <div className="flex flex-col gap-4 p-8 rpg-grid h-full">
              <Link
                href={howItWorksHref}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-lg uppercase tracking-widest text-foreground py-4 border-b border-indigo-900/30"
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="font-mono text-lg uppercase tracking-widest text-foreground py-4 border-b border-indigo-900/30"
              >
                Pricing
              </Link>
              <div className="py-4 border-b border-indigo-900/30">
                <AuthButton />
              </div>
              <Link
                href="/audit"
                onClick={() => setMobileOpen(false)}
                className="mt-6"
              >
                <button className="rpg-button rpg-button-primary w-full py-4 text-sm">
                  Start Free Audit
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
