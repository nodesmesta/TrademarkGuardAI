'use client';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { Target, AlertTriangle, Shield, ChevronRight } from 'lucide-react';
import MinimalThreeJSBackground from '@/components/MinimalThreeJSBackground';
import { useEffect, useState } from 'react';
interface HeroSectionProps {
  className?: string;
}
export default function HeroSection({ className = '' }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <section id="home" className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0">
        <MinimalThreeJSBackground />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/40 z-10" />
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-200">
                AI-POWERED VISUAL MONITORING
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block text-white">Protect Your</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Intellectual Property
              </span>
              <span className="block text-white mt-2">in the Digital Age</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
              Enterprise-grade trademark monitoring platform powered by AI visualization.
              Detect violations, analyze threats, and protect your brand across global networks with
              <span className="font-semibold text-blue-300"> 99.9% accuracy</span>.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-white">Threat Mapping</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-white">Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium text-white">Global Network</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link href="/dashboard">
                <Button
                  className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 backdrop-blur-sm"
                >
                  Launch Dashboard
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Request Enterprise Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                    <div className="text-sm text-blue-300">AI Accuracy</div>
                    <div className="mt-2 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white mb-2">24/7</div>
                    <div className="text-sm text-purple-300">Real-time Monitoring</div>
                    <div className="mt-2 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 p-6 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white mb-2">150+</div>
                    <div className="text-sm text-emerald-300">Countries Covered</div>
                    <div className="mt-2 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" />
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-br from-amber-900/30 to-amber-800/30 p-6 rounded-xl border border-amber-500/20 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white mb-2">10M+</div>
                    <div className="text-sm text-amber-300">Daily Scans</div>
                    <div className="mt-2 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Live Network Activity</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-green-400">Active</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Social Media', progress: 92, color: 'from-blue-500 to-cyan-500' },
                    { name: 'E-commerce', progress: 87, color: 'from-purple-500 to-pink-500' },
                    { name: 'Search Ads', progress: 78, color: 'from-emerald-500 to-green-500' },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>{item.name}</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
          </div>
        </div>
      </div>
      {mounted && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="relative">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-cyan-300 rounded-full mt-2" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
          </div>
        </div>
      )}
    </section>
  );
}