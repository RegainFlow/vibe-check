"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const open = searchParams.get("login") === "true";

  function dismiss() {
    router.replace("/", { scroll: false });
  }

  function signIn() {
    const supabase = createClient();
    supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/api/auth/callback`,
        },
      })
      .then(({ error }) => {
        if (error) toast.error("Sign-in failed. Please try again.");
      });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
          onClick={dismiss}
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
            <div className="rpg-panel-header absolute top-0 left-0 right-0">Identity Ritual</div>
            
            <div className="mt-8 flex flex-col items-center gap-6">
              <div className="size-16 flex items-center justify-center bg-indigo-950 border border-magenta/40 rounded-sm rotate-45 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                <div className="-rotate-45 font-mono text-2xl font-bold text-magenta">?</div>
              </div>
              
              <div className="text-center">
                <h2 className="font-mono text-lg font-bold text-foreground uppercase tracking-tighter glow-text-magenta">
                  Identify Yourself
                </h2>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground leading-relaxed">
                  Access your personal archives and historical inspections.
                </p>
              </div>

              <div className="w-full">
                <button
                  className="rpg-button rpg-button-primary w-full py-4 text-xs font-bold"
                  onClick={signIn}
                >
                  CONTINUE WITH GOOGLE
                </button>
              </div>
              
              <button
                onClick={dismiss}
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-magenta transition-colors"
              >
                [ Abort Ritual ]
              </button>
            </div>
            
            {/* Decorative Corner */}
            <div className="absolute bottom-0 right-0 size-8 border-b-2 border-r-2 border-indigo-900/50" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
