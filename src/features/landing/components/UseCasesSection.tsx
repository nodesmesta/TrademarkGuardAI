'use client';
import { Target, Shield } from 'lucide-react';
import { UseCase } from './types';
interface UseCasesSectionProps {
  className?: string;
  useCases?: UseCase[];
}
export default function UseCasesSection({ 
  className = '', 
  useCases: propUseCases 
}: UseCasesSectionProps) {
  const defaultUseCases: UseCase[] = [
    {
      title: 'E-commerce Brand Protection',
      description: 'Monitor unauthorized sellers and counterfeit products on marketplaces like Amazon, eBay, and Alibaba.'
    },
    {
      title: 'Social Media Surveillance',
      description: 'Track trademark violations across Facebook, Instagram, Twitter, and emerging social platforms.'
    },
    {
      title: 'Domain Name Monitoring',
      description: 'Detect cybersquatting and unauthorized use of your trademark in domain names.'
    },
    {
      title: 'Advertising Compliance',
      description: 'Monitor paid search and display ads for unauthorized use of your trademarks.'
    }
  ];
  const useCases = propUseCases || defaultUseCases;
  return (
    <section id="use-cases" className={`py-20 bg-gradient-to-b from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-4">
            <Target className="w-4 h-4" />
            REAL-WORLD APPLICATIONS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Protect Your Brand Across All Channels
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            How leading businesses use our platform to safeguard their intellectual property
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{useCase.title}</h3>
                </div>
                <p className="text-gray-400">{useCase.description}</p>
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <span className="text-sm text-purple-400 font-medium">View case study </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}