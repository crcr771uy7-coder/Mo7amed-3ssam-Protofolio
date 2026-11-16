import { motion, useReducedMotion } from 'motion/react';
import {
  BookOpen,
  Brain,
  Globe,
  MousePointerClick,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolioConfig';

const INTEREST_ICONS = {
  globe: Globe,
  book: BookOpen,
  mouse: MousePointerClick,
  sparkles: Sparkles,
  terminal: Terminal,
  brain: Brain,
};

export function LoveBuildingSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="building"
      className="py-24 sm:py-28 bg-[#0D0D0D] border-t border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37] uppercase mb-3">
            Creative Focus
          </p>
          <h2
            style={{ textWrap: 'balance' }}
            className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4"
          >
            What I Love Building
          </h2>
          <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed">
            Areas of software engineering, design, and experimentation where I
            channel my curiosity and keep sharpening my craft through personal
            projects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PORTFOLIO_CONFIG.loveBuilding.map((item, index) => {
            const Icon = INTEREST_ICONS[item.iconKey];
            return (
              <motion.article
                key={item.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.05, 0.25),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="luxury-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-[#A0A0A0]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#A0A0A0]">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
