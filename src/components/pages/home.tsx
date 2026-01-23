import { Toaster } from "@/components/ui/sonner";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DemoSection from "@/components/landing/DemoSection";
import PricingSection from "@/components/landing/PricingSection";
import WaitlistSection from "@/components/landing/WaitlistSection";
import FooterSection from "@/components/landing/FooterSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#1A1D29]">
      {/* Top Navigation */}
      <nav className="fixed top-0 right-0 z-50 p-6">
        <Button 
          size="lg"
          className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-6 py-3 rounded-lg border-2 border-[#FF6B6B] transition-all duration-150 hover:scale-105"
          onClick={() => navigate(user ? '/studio' : '/login')}
        >
          {user ? 'Launch Studio' : 'Studio Sign In'}
        </Button>
      </nav>

      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <PricingSection />
      <WaitlistSection />
      <FooterSection />
      <Toaster />
    </div>
  );
}
