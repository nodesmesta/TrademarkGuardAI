'use client'
import { ModularNavbar } from '@/features/layout/components/navbar/modular-navbar'
import { ModularFooter } from '@/features/layout/components/footer'
import HeroSection from '../components/HeroSection'
import LogoMarquee from '../components/LogoMarquee'
import FeaturesSection from '../components/FeaturesSection'
import HowItWorksSection from '../components/HowItWorksSection'
import PricingSection from '../components/PricingSection'
import UseCasesSection from '../components/UseCasesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import CTASection from '../components/CTASection'
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <ModularNavbar variant="transparent" showAuth={false} />
      <HeroSection />
      <LogoMarquee />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <UseCasesSection />
      <TestimonialsSection />
      <CTASection />
      <ModularFooter variant="default" />
    </div>
  )
}