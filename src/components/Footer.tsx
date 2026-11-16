import { PORTFOLIO_CONFIG } from '../config/portfolioConfig';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#050505] border-t border-white/[0.08] py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-6">
        <p className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-[0.22em] gold-gradient-text">
          {PORTFOLIO_CONFIG.brand.signature}
        </p>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[#A0A0A0]"
        >
          {['home', 'about', 'skills', 'projects', 'journey', 'contact'].map(
            (id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(id);
                }}
                className="capitalize hover:text-[#F5D77A] transition-colors"
              >
                {id}
              </a>
            )
          )}
        </nav>

        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

        <p className="text-xs sm:text-sm text-[#A0A0A0]">
          {PORTFOLIO_CONFIG.brand.footerCredit}
        </p>
      </div>
    </footer>
  );
}
