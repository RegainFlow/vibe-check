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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-sm mx-4 rounded-2xl border border-border bg-background p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-foreground text-center">
              Sign in to continue
            </h2>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Access your dashboard and audit history
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                className="h-11 px-8 text-sm font-semibold"
                onClick={signIn}
              >
                Continue with Google
              </Button>
            </div>
            <button
              onClick={dismiss}
              className="mt-3 w-full text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
