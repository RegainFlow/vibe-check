"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Github, Upload, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";

export default function AuditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"github" | "zip">("github");
  const [repoUrl, setRepoUrl] = useState(searchParams.get("url") ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleSubmitGithub(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const githubPattern = /^https?:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/;
    if (!githubPattern.test(repoUrl.trim())) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/audit/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim(), source: "github" }),
      });
      const text = await res.text();
      let data: Record<string, string>;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned an unexpected response. Please try again.");
      }
      if (!res.ok) throw new Error(data.error || "Failed to start audit");
      router.push(`/audit/${data.auditId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  }

  async function handleZipUpload(file: File) {
    if (!file.name.endsWith(".zip")) {
      setError("Please upload a .zip file");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be under 50MB");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/audit/start", {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      let data: Record<string, string>;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned an unexpected response. Please try again.");
      }
      if (!res.ok) throw new Error(data.error || "Failed to start audit");
      router.push(`/audit/${data.auditId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-40 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 rpg-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 dungeon-gradient pointer-events-none" />
        <div className="scanline" />

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tighter mb-4 uppercase glow-text-magenta">
              Audit Your <span className="text-gold glow-text-gold">Codebase</span>
            </h1>
            <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
              Paste a GitHub URL or upload a ZIP file to get started
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 mb-8 max-w-sm mx-auto relative border border-indigo-900/50 bg-indigo-950/20">
            <button
              onClick={() => setTab("github")}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-widest transition-all ${
                tab === "github"
                  ? "text-magenta border border-magenta/40 bg-magenta/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "github" && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-magenta" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub URL
              </span>
            </button>
            <button
              onClick={() => setTab("zip")}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-widest transition-all ${
                tab === "zip"
                  ? "text-magenta border border-magenta/40 bg-magenta/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "zip" && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-magenta" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload ZIP
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* GitHub Tab */}
            {tab === "github" && (
              <motion.form
                key="github"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmitGithub}
                className="space-y-6"
              >
                {/* Terminal-style frame */}
                <div className="terminal-frame shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <div className="terminal-header">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 rounded-full bg-red-500/70" />
                      <div className="size-2.5 rounded-full bg-yellow-500/70" />
                      <div className="size-2.5 rounded-full bg-green-500/70" />
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        repository
                      </span>
                    </div>
                  </div>
                  <div className="p-8 bg-indigo-950/20">
                    <label className="block font-mono text-xs font-bold uppercase tracking-widest mb-4 text-magenta/80">
                      Repository URL
                    </label>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-magenta/20 blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
                      <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-800" />
                        <input
                          type="url"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          placeholder="https://github.com/owner/repo"
                          className="rpg-input pl-12 h-14 w-full bg-indigo-950 border-2 border-indigo-900 focus:border-magenta/50"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-4">
                      Public repositories only. Private repo support coming soon.
                    </p>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !repoUrl.trim()}
                  className="rpg-button rpg-button-primary w-full h-16 text-sm font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
                  )}
                  {isLoading ? "STARTING AUDIT..." : "START AUDIT"}
                </button>
              </motion.form>
            )}

            {/* ZIP Tab */}
            {tab === "zip" && (
              <motion.div
                key="zip"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <motion.div
                  animate={{
                    borderColor: dragOver
                      ? "rgba(217, 70, 239, 0.8)"
                      : "rgba(49, 46, 129, 0.5)",
                    backgroundColor: dragOver
                      ? "rgba(49, 46, 129, 0.3)"
                      : "rgba(30, 27, 75, 0.2)",
                  }}
                  transition={{ duration: 0.2 }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleZipUpload(file);
                  }}
                  className="rpg-panel border-2 border-dashed p-10 sm:p-16 text-center transition-all flex flex-col items-center"
                >
                  <div className="size-16 border border-indigo-900 flex items-center justify-center bg-indigo-950 mb-6 rotate-45">
                    <Upload className="w-6 h-6 text-magenta -rotate-45" />
                  </div>
                  <p className="font-mono text-sm font-bold uppercase tracking-widest mb-2 text-foreground">
                    Drop your ZIP file here
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-8">
                    or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".zip"
                    className="hidden"
                    id="zip-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleZipUpload(file);
                    }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="rpg-button px-8 py-3 text-xs flex items-center justify-center"
                    onClick={() => document.getElementById("zip-upload")?.click()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {isLoading ? "UPLOADING..." : "CHOOSE FILE"}
                  </button>
                </motion.div>
                <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
                  Max 50MB. The ZIP will be extracted and analyzed server-side.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.div
              key={error}
              animate={{ x: [0, -8, 8, -8, 8, 0] }}
              transition={{ duration: 0.4 }}
              className="mt-6 p-4 rpg-panel border-red-500/30 bg-red-500/10 text-center"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">
                {error}
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
