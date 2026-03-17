"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Linkedin, Twitter } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);

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
              <Link href="/about" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-magenta transition-colors">About</Link>
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-magenta/80">Legal</h3>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-magenta transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-magenta transition-colors">Terms of Service</Link>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                <a href="https://www.linkedin.com/in/leonardo-j-ramirez" target="_blank" rel="noopener noreferrer" className="p-2 border border-indigo-900/50 bg-indigo-950/50 rounded-lg text-muted-foreground hover:text-magenta hover:border-magenta transition-all">
                  <Linkedin className="size-3.5" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 border border-indigo-900/50 bg-indigo-950/50 rounded-lg text-muted-foreground hover:text-magenta hover:border-magenta transition-all">
                  <Twitter className="size-3.5" />
                </a>
                <a href="https://www.reddit.com/user/Prestigious_Fly_3505" target="_blank" rel="noopener noreferrer" className="p-2 border border-indigo-900/50 bg-indigo-950/50 rounded-lg text-muted-foreground hover:text-magenta hover:border-magenta transition-all">
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 13.71c.147.422.22.864.22 1.317 0 2.78-3.2 5.032-7.148 5.032s-7.148-2.252-7.148-5.032c0-.453.073-.895.22-1.317a1.727 1.727 0 01-.436-1.14c0-.955.774-1.73 1.73-1.73.46 0 .877.18 1.187.473 1.16-.834 2.738-1.37 4.486-1.43l.896-4.22a.34.34 0 01.41-.262l2.95.62a1.214 1.214 0 012.296.5 1.214 1.214 0 01-1.214 1.214 1.214 1.214 0 01-1.183-.949l-2.612-.55-.794 3.74c1.706.074 3.242.61 4.376 1.43a1.726 1.726 0 011.187-.473c.956 0 1.73.775 1.73 1.73 0 .437-.163.837-.436 1.14zM9.06 13.88a1.214 1.214 0 100 2.428 1.214 1.214 0 000-2.428zm5.88 0a1.214 1.214 0 100 2.428 1.214 1.214 0 000-2.428zm-5.4 4.216c-.104-.104-.104-.272 0-.376a.266.266 0 01.376 0c.707.707 1.74 1.066 3.084 1.066s2.377-.359 3.084-1.066a.266.266 0 01.376 0c.104.104.104.272 0 .376-.783.783-1.928 1.18-3.46 1.18s-2.677-.397-3.46-1.18z"/></svg>
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

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 hover:text-magenta transition-colors cursor-pointer"
          >
            Who made this website?
          </button>
        </div>
      </div>

      {/* RegainFlow Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          >
            <div className="absolute inset-0 rpg-grid opacity-20 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-sm mx-4 rpg-panel bg-indigo-950/40 p-10 shadow-[0_0_50px_rgba(217,70,239,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rpg-panel-header absolute top-0 left-0 right-0">Origin Signal</div>

              <div className="mt-8 flex flex-col items-center gap-6">
                <div className="size-16 flex items-center justify-center bg-indigo-950 border border-magenta/40 rounded-sm rotate-45 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                  <div className="-rotate-45 font-mono text-2xl font-bold text-magenta">R</div>
                </div>

                <div className="text-center">
                  <h2 className="font-mono text-lg font-bold text-foreground uppercase tracking-tighter glow-text-magenta">
                    RegainFlow
                  </h2>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground leading-relaxed">
                    Built by RegainFlow — crafting tools that help founders ship with confidence.
                  </p>
                </div>

                <a
                  href="https://regainflow.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rpg-button rpg-button-primary w-full py-4 text-xs font-bold text-center"
                >
                  VISIT REGAINFLOW
                </a>

                <button
                  onClick={() => setShowModal(false)}
                  className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-magenta transition-colors cursor-pointer"
                >
                  [ Dismiss ]
                </button>
              </div>

              <div className="absolute bottom-0 right-0 size-8 border-b-2 border-r-2 border-indigo-900/50" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
