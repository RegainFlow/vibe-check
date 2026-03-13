import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/marketing/Hero";
import SocialProof from "@/components/marketing/SocialProof";
import HowItWorks from "@/components/marketing/HowItWorks";
import Features from "@/components/marketing/Features";
import SampleReport from "@/components/marketing/SampleReport";
import CTABanner from "@/components/marketing/CTABanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Features />
        <SampleReport />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
