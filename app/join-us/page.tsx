"use client";
import Footer from "@/components/common/layout/footer";
import {
  HeroSection,
  MissionSection,
  BenefitsSection,
  TestimonialsSection,
  FAQSection,
  FinalCTASection
} from "@/components/pages/join-us";

const JoinUsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <MissionSection />
      <BenefitsSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default JoinUsPage;
