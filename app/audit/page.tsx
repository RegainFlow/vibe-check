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

    const githubPattern = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
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
      <main className="pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-3">
            Audit Your <span className="gradient-text">Codebase</span>
          </h1>
          <p className="text-muted-foreground text-center mb-10 text-lg">
            Paste a GitHub URL or upload a ZIP file to get started
          </p>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-lg bg-secondary/50 mb-8 max-w-xs mx-auto relative">
            <button
              onClick={() => setTab("github")}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                tab === "github"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "github" && (
                <motion.div
                  layoutId="audit-tab-indicator"
                  className="absolute inset-0 rounded-md gradient-purple shadow-lg shadow-primary/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub URL
              </span>
            </button>
            <button
              onClick={() => setTab("zip")}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                tab === "zip"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "zip" && (
                <motion.div
                  layoutId="audit-tab-indicator"
                  className="absolute inset-0 rounded-md gradient-purple shadow-lg shadow-primary/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
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
                className="space-y-4"
              >
                {/* Terminal-style frame */}
                <div className="terminal-card">
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    <span className="ml-3 text-xs text-muted-foreground font-mono">
                      repository
                    </span>
                  </div>
                  <div className="p-6">
                    <label className="block text-sm font-medium mb-2">
                      Repository URL
                    </label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="url"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="https://github.com/owner/repo"
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Public repositories only. Private repo support coming soon.
                    </p>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !repoUrl.trim()}
                  className="w-full h-12 text-base gradient-purple border-0 text-white hover:opacity-90 transition-opacity animate-glow-pulse"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? "Starting Audit..." : "Start Audit"}
                </Button>
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
                className="space-y-4"
              >
                <motion.div
                  animate={{
                    borderColor: dragOver
                      ? "rgba(124, 58, 237, 1)"
                      : "rgba(255, 255, 255, 0.1)",
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
                  className={`rounded-xl border-2 border-dashed p-12 text-center transition-all ${
                    dragOver
                      ? "bg-primary/5 shadow-[0_0_30px_rgba(124,58,237,0.15)]"
                      : "bg-card/50"
                  }`}
                >
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-1">
                    Drop your ZIP file here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("zip-upload")?.click()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {isLoading ? "Uploading..." : "Choose File"}
                  </Button>
                </motion.div>
                <p className="text-xs text-muted-foreground text-center">
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
              className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
