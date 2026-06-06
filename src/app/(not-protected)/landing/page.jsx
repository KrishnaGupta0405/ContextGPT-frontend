"use client";

import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import FeaturesSection from "./FeaturesSection";
import HowToInstall from "./HowToInstall";
import CTASection from "./CTASection";
import FromTheAuthor from "./FromTheAuthor";
import FAQSection from "./FAQSection";
import BentoGrid from "./BentoGrid";
import ShowcaseCarousel from "./ShowcaseCarousel";
import {IntegrationHero} from "@/app/(not-protected)/integration/page";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <div className="px-[1rem] sm:px-26 lg:px-36">
        <HeroSection />
      </div>
      <div className="bg-gray-50 px-[1rem] sm:px-26 lg:px-36">
        
        <BentoGrid />
        {/* <HowToInstall /> */}
        <FeaturesSection />
      </div>
      <div className="bg-linear-to-b from-white to-blue-100 px-[1rem] sm:px-26 lg:px-36">
        <FromTheAuthor />
      </div>

      <div className="bg-black px-[1rem] sm:px-26 lg:px-36">
        {/* <HeroSection /> */}
        <ShowcaseCarousel />
      </div>
      <div className="bg-white px-4 lg:px-36">
        {/* <HowItWorksSection /> */}
        <FAQSection />
        {/* <CTASection /> */}
      </div>
    </div>
  );
}
