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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <CheckCircle className="size-5 text-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            VibeCheck
          </span>
        </Link>

        {/* Nav links (desktop) */}
        <div className="hidden sm:flex items-center gap-8">
          <Link
            href={howItWorksHref}
            className="relative text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/pricing"
            className="relative text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthButton />
          <Link href="/audit" className="hidden sm:block">
            <Button className="h-9 px-4 text-sm font-semibold bg-primary hover:bg-primary/90 transition-colors">
              Start Free Audit
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden size-9 flex items-center justify-center rounded-lg hover:bg-secondary/50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="size-5 text-foreground" />
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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-xl sm:hidden"
          >
            <div className="flex flex-col gap-2 p-6">
              <Link
                href={howItWorksHref}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-foreground py-3 border-b border-border/50"
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-foreground py-3 border-b border-border/50"
              >
                Pricing
              </Link>
              <div className="py-3 border-b border-border/50">
                <AuthButton />
              </div>
              <Link
                href="/audit"
                onClick={() => setMobileOpen(false)}
                className="mt-4"
              >
                <Button className="w-full h-12 text-base font-semibold gradient-purple border-0 text-white">
                  Start Free Audit
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
