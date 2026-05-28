'use client';
import { Testimonial } from './types';
interface TestimonialsSectionProps {
  className?: string;
  testimonials?: Testimonial[];
}
export default function TestimonialsSection({ 
  className = '', 
  testimonials: propTestimonials 
}: TestimonialsSectionProps) {
  const defaultTestimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Head of Legal, TechCorp',
      content: 'TradeGuard AI has reduced our trademark enforcement time by 80%. The AI agents catch violations we would have missed.',
      company: 'TechCorp'
    },
    {
      name: 'Michael Chen',
      role: 'Brand Manager, StyleHub',
      content: 'Real-time monitoring across social media platforms has been a game-changer for our brand protection strategy.',
      company: 'StyleHub'
    },
    {
      name: 'Elena Rodriguez',
      role: 'VP of Marketing, InnovateLabs',
      content: 'The analytics dashboard provides insights that help us make data-driven decisions about brand positioning.',
      company: 'InnovateLabs'
    }
  ];
  const testimonials = propTestimonials || defaultTestimonials;
  return (
    <section className={`py-20 bg-gradient-to-b from-gray-900 to-gray-950 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium mb-4">
            ★
            CUSTOMER SUCCESS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See what our customers say about our platform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic mb-4">"{testimonial.content}"</p>
                <div className="text-blue-400 font-semibold">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}