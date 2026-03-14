"use client";

import Link from "next/link";
import { CheckCircle, Github, Twitter } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-background">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <CheckCircle className="size-4 text-primary" />
              <span className="text-sm font-bold tracking-tight text-foreground">
                VibeCheck
              </span>
            </Link>
            <p className="text-xs text-muted-foreground">
              AI code audits for non-technical founders.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/#how-it-works"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/audit"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Start Audit
            </Link>
          </div>

          {/* Social icons + Copyright */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                aria-label="GitHub"
              >
                <Github className="size-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="size-4" />
              </a>
              <ThemeToggle />
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} VibeCheck. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
