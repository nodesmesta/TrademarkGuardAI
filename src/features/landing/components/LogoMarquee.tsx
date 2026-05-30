'use client';

const logos = [
  {
    name: 'BrightData',
    href: 'https://brightdata.com',
    svg: (
      <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.9" />
        <circle cx="16" cy="16" r="7" fill="currentColor" opacity="0.6" />
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
        <rect x="2" y="4" width="18" height="24" rx="4" fill="currentColor" />
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
        <circle cx="10" cy="16" r="4" fill="currentColor" />
        <circle cx="22" cy="8" r="3" fill="currentColor" opacity="0.7" />
        <circle cx="22" cy="24" r="3" fill="currentColor" opacity="0.7" />
        <line x1="13" y1="14" x2="20" y2="10" stroke="currentColor" strokeWidth="1.5" />
        <line x1="13" y1="18" x2="20" y2="22" stroke="currentColor" strokeWidth="1.5" />
        <text x="32" y="21" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="13" fill="currentColor">AI/ML API</text>
      </svg>
    ),
  },
  {
    name: 'Triggerware',
    href: 'https://triggerware.ai',
    svg: (
      <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <polygon points="8,4 20,16 8,28" fill="currentColor" opacity="0.9" />
        <polygon points="14,8 24,16 14,24" fill="currentColor" opacity="0.5" />
        <text x="30" y="21" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="12" fill="currentColor">Triggerware</text>
      </svg>
    ),
  },
  {
    name: 'LabLabAI',
    href: 'https://lablab.ai',
    svg: (
      <svg viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
        <rect x="2" y="8" width="6" height="16" rx="2" fill="currentColor" />
        <rect x="10" y="4" width="6" height="20" rx="2" fill="currentColor" opacity="0.8" />
        <rect x="18" y="10" width="6" height="14" rx="2" fill="currentColor" opacity="0.6" />
        <text x="30" y="21" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="13" fill="currentColor">LabLabAI</text>
      </svg>
    ),
  },
];

export default function LogoMarquee() {
  return (
    <section className="relative py-10 overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" />

      <div className="relative z-10">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
          Powered by &amp; Built with
        </p>

        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

          <div className="flex w-max animate-[marquee_15s_linear_infinite]">
            {[0, 1, 2].map((setIndex) => (
              <div key={setIndex} className="flex shrink-0 items-center gap-16 px-8">
                {logos.map((logo, i) => (
                  <a
                    key={i}
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 shrink-0 grayscale hover:grayscale-0"
                    title={logo.name}
                  >
                    {logo.svg}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
