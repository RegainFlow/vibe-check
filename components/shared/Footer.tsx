"use client";

import Link from "next/link";
import { CheckCircle, Github, Twitter } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Footer() {
  return (
    <footer className="relative border-t border-indigo-900/50 bg-background overflow-hidden">
      <div className="absolute inset-0 rpg-grid opacity-10 pointer-events-none" />
      <div className="hud-line absolute top-0 left-0" />

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="size-6 flex items-center justify-center bg-indigo-950 border border-magenta/40 rounded-sm rotate-45 group-hover:border-magenta transition-all">
                <CheckCircle className="size-3.5 text-magenta -rotate-45" />
              </div>
              <span className="text-lg font-mono font-bold tracking-tighter text-foreground uppercase glow-text-magenta">
                VibeCheck
              </span>
            </Link>
            <p className="max-w-xs font-mono text-[10px] uppercase tracking-widest text-muted-foreground leading-relaxed">
              AI code audits for non-technical founders. Ensure your codebase is ship-ready.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-magenta/80">Navigation</h3>
            <div className="flex flex-col gap-2">
              <Link href="/#how-it-works" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-magenta transition-colors">How It Works</Link>
              <Link href="/pricing" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-magenta transition-colors">Pricing</Link>
              <Link href="/audit" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-magenta transition-colors">Start Audit</Link>
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-magenta/80">Legal</h3>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-magenta transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-magenta transition-colors">Terms of Service</Link>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                <a href="#" className="p-2 border border-indigo-900/50 bg-indigo-950/50 text-muted-foreground hover:text-magenta hover:border-magenta transition-all">
                  <Twitter className="size-3.5" />
                </a>
                <a href="#" className="p-2 border border-indigo-900/50 bg-indigo-950/50 text-muted-foreground hover:text-magenta hover:border-magenta transition-all">
                  <Github className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-indigo-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
            &copy; {new Date().getFullYear()} VibeCheck. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-magenta/50 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">System Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
