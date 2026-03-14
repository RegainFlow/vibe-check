import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import PageTransition from "@/components/shared/PageTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "VibeCheck — AI Code Audit for Non-Technical Founders",
    template: "%s | VibeCheck",
  },
  description:
    "Get a plain-English audit of your AI-built codebase. Scored across 7 categories with actionable fix prompts. Ship with confidence.",
  openGraph: {
    title: "VibeCheck — AI Code Audit for Non-Technical Founders",
    description:
      "Get a plain-English audit of your AI-built codebase in 60 seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PageTransition>{children}</PageTransition>
          <Toaster
            theme="system"
            position="bottom-right"
            toastOptions={{
              className: "!bg-card !text-card-foreground !border-border",
            }}
          />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
