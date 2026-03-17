import { Suspense } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/marketing/Hero";
import SocialProof from "@/components/marketing/SocialProof";
import HowItWorks from "@/components/marketing/HowItWorks";
import Features from "@/components/marketing/Features";
import SampleReport from "@/components/marketing/SampleReport";
import CTABanner from "@/components/marketing/CTABanner";
import LoginModal from "@/components/shared/LoginModal";
import { getSampleReport } from "@/lib/sample-report";
import { getPlatformStats } from "@/lib/platform-stats";

export default async function Home() {
  const [sampleData, platformStats] = await Promise.all([
    getSampleReport(),
    getPlatformStats(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Suspense fallback={null}>
          <LoginModal />
        </Suspense>
        <Hero />
        <SocialProof stats={platformStats} />
        <HowItWorks />
        <Features />
        <SampleReport data={sampleData} />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
