import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PLANS } from "@/lib/constants";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?login=true");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan as "free" | "pro" | "team") ?? "free";
  const userName = profile?.full_name ?? user.email ?? "";

  return (
    <DashboardShell
      user={{
        email: user.email ?? "",
        name: userName,
        plan,
        auditsUsed: profile?.audits_used_this_month ?? 0,
        auditsLimit:
          PLANS[plan].auditsPerMonth === Infinity
            ? 999
            : PLANS[plan].auditsPerMonth,
      }}
    >
      {children}
    </DashboardShell>
  );
}
