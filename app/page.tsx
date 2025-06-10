import HeroSection from "@/components/home/hero-section";
import BigGradient from "@/components/common/bg-gradient";
import DemoSection from "@/components/home/demo-section";
import HowitWorksSection from "@/components/home/how-it-works";
import PricingSection from "@/components/home/pricing-section";
import CTASection from "@/components/home/cta-section";

export default function Home() {
  return (
    <div className="relative w-full">
        <BigGradient/>
    <div className="flex flex-col">
    <HeroSection/>
    <DemoSection/>
    <HowitWorksSection/>
    <PricingSection/>
    <CTASection/>

    </div>

    
  
    </div>
  );
}
