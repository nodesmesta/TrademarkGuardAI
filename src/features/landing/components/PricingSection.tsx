'use client';
import Link from 'next/link';
import { CreditCard, Check } from 'lucide-react';
import { PricingPlan } from './types';
interface PricingSectionProps {
  className?: string;
  plans?: PricingPlan[];
}
export default function PricingSection({ 
  className = '', 
  plans: propPlans 
}: PricingSectionProps) {
  const defaultPlans: PricingPlan[] = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small businesses',
      features: [
        '1 Trademark monitored',
        'Daily monitoring frequency',
        'Basic analytics dashboard',
        'Email alerts',
        '5,000 monthly scans',
        '7-day data retention'
      ],
      ctaText: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '$299',
      period: '/month',
      description: 'For growing businesses',
      features: [
        '5 Trademarks monitored',
        'Real-time monitoring',
        'Advanced analytics',
        'Slack & Email alerts',
        '50,000 monthly scans',
        '30-day data retention',
        'API access',
        'Priority support'
      ],
      ctaText: 'Get Started',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Unlimited trademarks',
        'Real-time monitoring',
        'Custom analytics',
        'Multi-channel alerts',
        'Unlimited scans',
        '90+ days data retention',
        'Full API access',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee'
      ],
      ctaText: 'Contact Sales',
      popular: false
    }
  ];
  const plans = propPlans || defaultPlans;
  return (
    <section id="pricing" className={`py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-4">
            <CreditCard className="w-4 h-4" />
            TRANSPARENT PRICING
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Predictable Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative ${plan.popular ? 'scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <div className={`bg-gradient-to-b ${plan.popular ? 'from-blue-900/30 to-gray-900 border-blue-500/50' : 'from-gray-800/30 to-gray-900 border-gray-700'} rounded-2xl shadow-xl p-8 border-2 h-full`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.name === 'Enterprise' ? '/contact' : '/signup'}>
                  <button
                    className={`w-full py-6 text-lg font-semibold ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white' : 'border border-gray-600 text-white hover:bg-gray-800'} rounded-lg`}
                  >
                    {plan.ctaText}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Enterprise pricing available for organizations with advanced visualization requirements.
          </p>
        </div>
      </div>
    </section>
  );
}