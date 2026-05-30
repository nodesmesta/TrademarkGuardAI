'use client';

const logos = [
  {
    name: 'BrightData',
    href: 'https://brightdata.com',
    svg: (
      <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <circle cx="16" cy="16" r="12" fill="#FF6B35" opacity="0.9" />
        <circle cx="16" cy="16" r="7" fill="#FF8C5A" />
        <circle cx="16" cy="16" r="3" fill="white" />
        <text x="34" y="21" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="13" fill="currentColor">BrightData</text>
      </svg>
    ),
  },
  {
    name: 'Kiro',
    href: 'https://kiro.dev',
    svg: (
      <svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <rect x="2" y="4" width="18" height="24" rx="4" fill="#6366F1" />
        <path d="M8 10 L14 16 L8 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="26" y="21" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="14" fill="currentColor">Kiro</text>
      </svg>
    ),
  },
  {
    name: 'AI/ML API',
    href: 'https://aimlapi.com',
    svg: (
      <svg viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <circle cx="10" cy="16" r="4" fill="#10B981" />
        <circle cx="22" cy="8" r="3" fill="#10B981" opacity="0.7" />
        <circle cx="22" cy="24" r="3" fill="#10B981" opacity="0.7" />
        <line x1="13" y1="14" x2="20" y2="10" stroke="#10B981" strokeWidth="1.5" />
        <line x1="13" y1="18" x2="20" y2="22" stroke="#10B981" strokeWidth="1.5" />
        <text x="32" y="21" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="13" fill="currentColor">AI/ML API</text>
      </svg>
    ),
  },
  {
    name: 'Next.js',
    href: 'https://nextjs.org',
    svg: (
      <svg viewBox="0 0 90 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <circle cx="14" cy="16" r="11" fill="#000" stroke="#444" strokeWidth="1" />
        <text x="8" y="21" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="13" fill="white">N</text>
        <text x="30" y="21" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="13" fill="currentColor">Next.js</text>
      </svg>
    ),
  },
  {
    name: 'Supabase',
    href: 'https://supabase.com',
    svg: (
      <svg viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <path d="M8 24 L16 8 L20 16 L14 24Z" fill="#3ECF8E" />
        <path d="M20 8 L12 24 L8 16 L14 8Z" fill="#3ECF8E" opacity="0.5" />
        <text x="28" y="21" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="13" fill="currentColor">Supabase</text>
      </svg>
    ),
  },
  {
    name: 'LabLabAI',
    href: 'https://lablab.ai',
    svg: (
      <svg viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <rect x="2" y="8" width="6" height="16" rx="2" fill="#F59E0B" />
        <rect x="10" y="4" width="6" height="20" rx="2" fill="#F59E0B" opacity="0.8" />
        <rect x="18" y="10" width="6" height="14" rx="2" fill="#F59E0B" opacity="0.6" />
        <text x="30" y="21" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="13" fill="currentColor">LabLabAI</text>
      </svg>
    ),
  },
];

export default function LogoMarquee() {
  const doubled = [...logos, ...logos];

  return (
    <section className="py-10 bg-gray-900/50 border-y border-white/5 overflow-hidden">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
        Powered by &amp; Built with
      </p>
      <div className="relative flex">
        <div className="flex animate-marquee gap-16 items-center whitespace-nowrap">
          {doubled.map((logo, i) => (
            <a
              key={i}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 shrink-0"
              title={logo.name}
            >
              {logo.svg}
            </a>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
