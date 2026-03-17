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
        <Loader2 className="w-6 h-6 animate-spin text-magenta" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 pb-6 border-b border-indigo-900/30">
        <h1 className="text-2xl font-mono font-bold uppercase tracking-tight text-foreground glow-text-magenta">Settings</h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Profile */}
        <div className="rpg-panel p-8 bg-indigo-950/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-md border border-magenta/40 bg-indigo-950 flex items-center justify-center rotate-45">
              <User className="w-6 h-6 text-magenta -rotate-45" />
            </div>
            <div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-tight text-foreground">Profile</h2>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
                Your personal information
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div>
              <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-magenta/80 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rpg-input"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-magenta/80 mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="rpg-input opacity-50 cursor-not-allowed"
              />
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-2">
                Email cannot be changed
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="rpg-button rpg-button-primary px-8 py-3 text-xs"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  SAVING...
                </div>
              ) : saved ? "SAVED!" : "SAVE CHANGES"}
            </button>
          </form>
        </div>

        {/* Plan & Billing */}
        <div className="rpg-panel p-8 bg-indigo-950/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-md border border-amber-500/40 bg-indigo-950 flex items-center justify-center rotate-45">
              <CreditCard className="w-6 h-6 text-amber-400 -rotate-45" />
            </div>
            <div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-tight text-foreground">Plan & Billing</h2>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
                Manage your subscription
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-indigo-900/50 bg-indigo-950/40 p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-bold uppercase tracking-tight text-foreground mb-1">
                  {plan} Plan
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {plan === "free"
                    ? "3 audits per month"
                    : "Unlimited audits"}
                </p>
              </div>
              <span
                className={`font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border ${
                  plan === "free"
                    ? "border-indigo-800/50 text-muted-foreground bg-indigo-950/50"
                    : "border-magenta/40 text-magenta bg-magenta/5"
                }`}
              >
                {plan === "free" ? "Free" : "Active"}
              </span>
            </div>
          </div>

          {plan !== "free" && (
            <button onClick={handleManageBilling} className="rpg-button px-6 py-2.5 text-xs">
              MANAGE BILLING
            </button>
          )}
        </div>

        {/* Danger Zone */}
        <div className="rpg-panel p-8 border-red-500/30 bg-red-950/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-md border border-red-500/40 bg-red-950 flex items-center justify-center rotate-45">
              <Trash2 className="w-6 h-6 text-red-500 -rotate-45" />
            </div>
            <div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-tight text-red-500">Danger Zone</h2>
              <p className="font-mono text-[9px] uppercase tracking-widest text-red-400/70 mt-1">
                Irreversible actions
              </p>
            </div>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-6 leading-relaxed">
            Permanently delete your account, audit history, and all associated
            data. This action cannot be undone.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest mb-2 text-muted-foreground">
                Type <span className="text-red-400 font-bold border border-red-500/30 bg-red-950/30 px-1 py-0.5 mx-1">delete my account</span> to confirm
              </label>
              <input
                type="text"
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                className="w-full h-12 px-4 rounded-lg bg-indigo-950/80 border-2 border-red-900/50 text-sm font-mono text-foreground focus:outline-hidden focus:border-red-500/50 transition-all uppercase"
                placeholder="DELETE MY ACCOUNT"
              />
            </div>
            <button
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-950/80 border-2 border-red-500/40 text-red-400 hover:bg-red-900/60 hover:border-red-500 hover:text-red-300 font-mono uppercase tracking-tighter transition-all duration-200 active:translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  DELETING...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  DELETE ACCOUNT
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
