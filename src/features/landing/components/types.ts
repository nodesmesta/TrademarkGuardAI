import { ReactNode } from 'react';
export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}
export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
  popular: boolean;
}
export interface Testimonial {
  name: string;
  role: string;
  content: string;
  company: string;
}
export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: ReactNode;
}
export interface FAQItem {
  question: string;
  answer: string;
  category: string;
  stats: string;
  icon: string;
}
export interface UseCase {
  title: string;
  description: string;
}
export interface SectionProps {
  className?: string;
}