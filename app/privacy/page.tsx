import Navbar from "@/components/shared/Navbar";

export const metadata = {
  title: "Privacy Policy — VibeCheck",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 rpg-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 dungeon-gradient pointer-events-none" />
      <div className="scanline" />
      
      <Navbar />
      <main className="pt-40 pb-24 px-4 relative z-10">
        <article className="prose prose-neutral dark:prose-invert max-w-2xl mx-auto rpg-panel p-8 md:p-12 bg-indigo-950/20">
          <h1 className="font-mono text-3xl font-bold uppercase tracking-tight text-foreground glow-text-magenta mb-2">Privacy Policy</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-8">Last updated: March 13, 2026</p>

          <h2 className="font-mono text-xl font-bold uppercase tracking-tight text-foreground mt-8 mb-4">What we collect</h2>
          <p className="text-sm text-muted-foreground mb-4">
            When you use VibeCheck we collect only what is necessary to provide
            the service:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground mb-8">
            <li>
              <strong className="text-foreground">Account information</strong> — If you sign in with Google,
              we receive your name and email address from Google OAuth.
            </li>
            <li>
              <strong className="text-foreground">Repository data</strong> — We clone the public repository
              URL you provide, analyze it in memory, and delete the clone after
              the audit completes. We do not store your source code.
            </li>
            <li>
              <strong className="text-foreground">Audit results</strong> — Findings, scores, and generated
              reports are stored so you can access them later.
            </li>
            <li>
              <strong className="text-foreground">Usage data</strong> — Basic analytics such as page views
              and IP addresses for rate limiting. We do not use third-party
              trackers.
            </li>
          </ul>

          <h2 className="font-mono text-xl font-bold uppercase tracking-tight text-foreground mt-8 mb-4">How we use your data</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground mb-8">
            <li>To run code audits and generate reports.</li>
            <li>To enforce usage limits and prevent abuse.</li>
            <li>To improve the service.</li>
          </ul>

          <h2 className="font-mono text-xl font-bold uppercase tracking-tight text-foreground mt-8 mb-4">Third-party services</h2>
          <p className="text-sm text-muted-foreground mb-4">We use the following third-party services to operate VibeCheck:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground mb-8">
            <li>
              <strong className="text-foreground">Supabase</strong> — Authentication and database hosting.
            </li>
            <li>
              <strong className="text-foreground">OpenAI</strong> — Finding descriptions are rewritten using
              OpenAI&apos;s API. Only finding metadata (category, title, file
              path, code snippet) is sent — never your full source code.
            </li>
            <li>
              <strong className="text-foreground">Stripe</strong> — Payment processing (when paid plans are
              available).
            </li>
            <li>
              <strong className="text-foreground">Vercel</strong> — Hosting and deployment.
            </li>
          </ul>

          <h2 className="font-mono text-xl font-bold uppercase tracking-tight text-foreground mt-8 mb-4">Data retention</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Audit reports are retained indefinitely while your account is
            active. You may request deletion of your data at any time by
            contacting us.
          </p>

          <h2 className="font-mono text-xl font-bold uppercase tracking-tight text-foreground mt-8 mb-4">Contact</h2>
          <p className="text-sm text-muted-foreground">
            If you have questions about this policy, please reach out at{" "}
            <a href="mailto:support@vibecheck.dev" className="text-magenta hover:underline">support@vibecheck.dev</a>.
          </p>
        </article>
      </main>
    </div>
  );
}
