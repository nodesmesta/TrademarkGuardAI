'use client';
import { Clock, Upload, Search, Globe as GlobeWork, FileText, ChevronRight } from 'lucide-react';
import { HowItWorksStep } from './types';
interface HowItWorksSectionProps {
  className?: string;
  steps?: HowItWorksStep[];
}
export default function HowItWorksSection({ 
  className = '', 
  steps: propSteps 
}: HowItWorksSectionProps) {
  const defaultSteps: HowItWorksStep[] = [
    {
      step: 1,
      title: 'Upload Trademark Assets',
      description: 'Upload your trademark logos, names, and product images. Our AI analyzes visual and textual elements for comprehensive protection.',
      icon: <Upload className="w-8 h-8 text-blue-600" />
    },
    {
      step: 2,
      title: 'AI-Powered Scanning',
      description: 'Our autonomous agents continuously scan the web, social media, and e-commerce platforms across 150+ countries for potential violations.',
      icon: <Search className="w-8 h-8 text-blue-600" />
    },
    {
      step: 3,
      title: 'Threat Mapping',
      description: 'Violations are visualized in an interactive dashboard showing geographical patterns, threat severity, and network connections.',
      icon: <GlobeWork className="w-8 h-8 text-blue-600" />
    },
    {
      step: 4,
      title: 'Actionable Insights',
      description: 'Receive detailed reports with evidence, recommended actions, and automated takedown requests through our legal network.',
      icon: <FileText className="w-8 h-8 text-blue-600" />
    }
  ];
  const steps = propSteps || defaultSteps;
  return (
    <section id="how-it-works" className={`py-20 bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 text-blue-300 text-sm font-medium mb-4">
            <Clock className="w-4 h-4" />
            HOW IT WORKS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple 4-Step Process to Protect Your Brand
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get started in minutes and see results immediately with our streamlined workflow
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className={`relative group ${index % 4 === 0 ? 'transform hover:-translate-y-2' : index % 4 === 1 ? 'transform hover:translate-y-2' : index % 4 === 2 ? 'transform hover:-translate-x-1' : 'transform hover:translate-x-1'} transition-all duration-300`}>
              <div className={`absolute -inset-1 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                index % 4 === 0 ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' :
                index % 4 === 1 ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20' :
                index % 4 === 2 ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' :
                'bg-gradient-to-r from-blue-500/20 to-cyan-500/20'
              }`} />
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 h-full ${
                index % 4 === 0 ? 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20' :
                index % 4 === 1 ? 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20' :
                index % 4 === 2 ? 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20' :
                'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20'
              }`}>
                <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  index % 4 === 0 ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-blue-500/30' :
                  index % 4 === 1 ? 'bg-gradient-to-br from-cyan-600 to-emerald-600 shadow-cyan-500/30' :
                  index % 4 === 2 ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-purple-500/30' :
                  'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-blue-500/30'
                }`}>
                  <span className="text-white font-bold text-xl">{step.step}</span>
                </div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${
                  index % 4 === 0 ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10' :
                  index % 4 === 1 ? 'bg-gradient-to-br from-cyan-500/10 to-emerald-500/10' :
                  index % 4 === 2 ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' :
                  'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
                }`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className={`w-8 h-0.5 ${
                      index % 4 === 0 ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30' :
                      index % 4 === 1 ? 'bg-gradient-to-r from-cyan-500/30 to-emerald-500/30' :
                      index % 4 === 2 ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30' :
                      'bg-gradient-to-r from-blue-500/30 to-cyan-500/30'
                    }`} />
                    <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                      <ChevronRight className={`w-4 h-4 ${
                        index % 4 === 0 ? 'text-blue-400' :
                        index % 4 === 1 ? 'text-cyan-400' :
                        index % 4 === 2 ? 'text-purple-400' :
                        'text-blue-400'
                      }`} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}