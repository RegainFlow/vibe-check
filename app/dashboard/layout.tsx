import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
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
    <div className="min-h-screen bg-background flex">
      <DashboardNav
        user={{
          email: user.email ?? "",
          name: userName,
          plan,
          auditsUsed: profile?.audits_used_this_month ?? 0,
          auditsLimit: PLANS[plan].auditsPerMonth === Infinity ? 999 : PLANS[plan].auditsPerMonth,
        }}
      />
      <div className="flex-1 md:ml-72 flex flex-col">
        <DashboardTopBar userName={userName} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
