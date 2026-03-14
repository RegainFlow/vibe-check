"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="size-8" />;
  }

  if (user) {
    return (
      <Link
        href="/dashboard"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        const supabase = createClient();
        supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${location.origin}/api/auth/callback`,
          },
        });
      }}
    >
      Sign In
    </Button>
  );
}
