"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, CreditCard, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setName(profile.full_name ?? "");
        setPlan(profile.plan ?? "free");
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleManageBilling() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="glow-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Profile</h2>
              <p className="text-xs text-muted-foreground">
                Your personal information
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-white/10 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-white/10 text-sm text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="gradient-purple border-0 text-white hover:opacity-90"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </form>
        </div>

        {/* Plan & Billing */}
        <div className="glow-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Plan & Billing</h2>
              <p className="text-xs text-muted-foreground">
                Manage your subscription
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-background/50 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                </p>
                <p className="text-sm text-muted-foreground">
                  {plan === "free"
                    ? "3 audits per month"
                    : "Unlimited audits"}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  plan === "free"
                    ? "bg-white/10 text-muted-foreground"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {plan === "free" ? "Free" : "Active"}
              </span>
            </div>
          </div>

          {plan === "free" ? (
            <Button
              onClick={() => (window.location.href = "/pricing")}
              className="gradient-purple border-0 text-white hover:opacity-90"
            >
              Upgrade to Pro
            </Button>
          ) : (
            <Button variant="outline" onClick={handleManageBilling}>
              Manage Billing
            </Button>
          )}
        </div>

        {/* Notifications */}
        <div className="glow-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-xs text-muted-foreground">
                Configure how you receive updates
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Audit complete",
                desc: "Get notified when an audit finishes",
              },
              {
                label: "Weekly digest",
                desc: "Summary of your audit activity",
              },
              {
                label: "Product updates",
                desc: "New features and improvements",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-background/30 p-4"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <button className="relative w-10 h-6 rounded-full bg-white/10 transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground transition-transform" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Notification preferences coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
