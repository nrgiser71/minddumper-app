import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PainPointsSection from "@/components/PainPointsSection";
import StopCarryingSection from "@/components/StopCarryingSection";
import FeatureSection from "@/components/FeatureSection";
import ProductDirectionSection from "@/components/ProductDirectionSection";
import IssueTrackingSection from "@/components/IssueTrackingSection";
import AISection from "@/components/AISection";
import CollaborationSection from "@/components/CollaborationSection";
import FoundationsSection from "@/components/FoundationsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
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
};

export default Index;
