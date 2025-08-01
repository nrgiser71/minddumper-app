'use client'

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PainPointsSection from "@/components/PainPointsSection";
import StopCarryingSection from "@/components/StopCarryingSection";
import FeatureSection from "@/components/FeatureSection";
import IssueTrackingSection from "@/components/IssueTrackingSection";
import FoundationsSection from "@/components/FoundationsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <PainPointsSection />
      <StopCarryingSection />
      <FoundationsSection />
      <FeatureSection />
      <IssueTrackingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}