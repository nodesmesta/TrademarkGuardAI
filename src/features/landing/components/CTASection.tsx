'use client';
import { Button } from '@heroui/react';
import Link from 'next/link';
interface CTASectionProps {
  className?: string;
}
export default function CTASection({ className = '' }: CTASectionProps) {
  return (
    <section className={`py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Protect Your Brand?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join thousands of businesses who trust our platform for enterprise-grade trademark protection
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button
              className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-white to-gray-100 text-blue-700 hover:from-gray-100 hover:to-white shadow-2xl"
            >
              Start 14-Day Free Trial
            </Button>
          </Link>
          <Button 
            variant="outline"
            className="px-8 py-6 text-lg font-semibold border-white text-white hover:bg-white/10 backdrop-blur-sm"
          >
            Schedule Enterprise Demo
          </Button>
        </div>
        <p className="text-blue-200 mt-6 text-sm">
          No credit card required • 24/7 support • Cancel anytime
        </p>
      </div>
    </section>
  );
}