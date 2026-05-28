'use client';
import { Zap, Eye, BarChart, Globe, Cpu, Lock, Network } from 'lucide-react';
import { Feature } from './types';
interface FeaturesSectionProps {
  className?: string;
  features?: Feature[];
}
export default function FeaturesSection({ 
  className = '', 
  features: propFeatures 
}: FeaturesSectionProps) {
  const defaultFeatures: Feature[] = [
    {
      title: 'Real-time Monitoring',
      description: '24/7 surveillance with AI-powered trademark violation detection across the web',
      icon: <Eye className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Advanced Analytics',
      description: 'Comprehensive data visualization, threat scoring, and actionable insights',
      icon: <BarChart className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Global Coverage',
      description: 'Monitor trademarks across 150+ countries and all major social platforms',
      icon: <Globe className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'AI-Powered Agents',
      description: 'Autonomous agents powered by OpenClaw for continuous monitoring and analysis',
      icon: <Cpu className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Multi-Brand Protection',
      description: 'Manage and protect multiple trademarks from a single dashboard',
      icon: <Lock className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Network Intelligence',
      description: 'Deep web and dark web monitoring with advanced threat detection',
      icon: <Network className="w-8 h-8 text-blue-600" />
    }
  ];
  const features = propFeatures || defaultFeatures;
  return (
    <section id="features" className={`py-20 bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            ENTERPRISE FEATURES
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need for Complete Brand Protection
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our platform combines cutting-edge AI technology with industry best practices
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <span className="text-sm text-blue-400 font-medium">Learn more →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}