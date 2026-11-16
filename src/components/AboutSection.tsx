import { motion, useReducedMotion } from 'motion/react';
import { Brain, Globe, Layers, Terminal } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolioConfig';

const PILLAR_ICONS = {
  terminal: Terminal,
  globe: Globe,
  brain: Brain,
  layers: Layers,
};

export function AboutSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="py-24 sm:py-28 bg-[#0D0D0D] border-t border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Narrative Column */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37] uppercase mb-3">
              About Me
            </p>
            <h2
              style={{ textWrap: 'balance' }}
              className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
            >
              {PORTFOLIO_CONFIG.about.title}
            </h2>

            <div className="space-y-4 text-base leading-relaxed text-[#A0A0A0]">
              {PORTFOLIO_CONFIG.about.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          {/* 4 Focus Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PORTFOLIO_CONFIG.about.pillars.map((pillar, index) => {
              const Icon = PILLAR_ICONS[pillar.iconKey];
              return (
                <motion.article
                  key={pillar.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="luxury-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/30 flex items-center justify-center mb-5 text-[#F5D77A]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#A0A0A0]">
                      {pillar.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
