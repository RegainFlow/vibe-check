"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User, CreditCard, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

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

          {plan !== "free" && (
            <Button variant="outline" onClick={handleManageBilling}>
              Manage Billing
            </Button>
          )}
        </div>

        {/* Danger Zone */}
        <div className="glow-card p-6 border-destructive/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-destructive">Danger Zone</h2>
              <p className="text-xs text-muted-foreground">
                Irreversible actions
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account, audit history, and all associated
            data. This action cannot be undone.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Type <span className="font-mono text-destructive">delete my account</span> to confirm
              </label>
              <input
                type="text"
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-destructive/20 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-destructive/50 focus:border-destructive/50 transition-all"
                placeholder="delete my account"
              />
            </div>
            <Button
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
              disabled={confirmDelete !== "delete my account" || deleting}
              onClick={async () => {
                setDeleting(true);
                const res = await fetch("/api/account/delete", {
                  method: "DELETE",
                });
                if (res.ok) {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  router.push("/");
                } else {
                  setDeleting(false);
                }
              }}
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {deleting ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
