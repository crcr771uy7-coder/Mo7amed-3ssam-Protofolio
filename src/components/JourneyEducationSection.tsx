import { motion, useReducedMotion } from 'motion/react';
import { GraduationCap, MapPin } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolioConfig';

export function JourneyEducationSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="journey"
      className="py-24 sm:py-28 bg-[#050505] border-t border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Vertical Development Journey Timeline */}
          <div className="lg:col-span-7">
            <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37] uppercase mb-3">
              My Development Journey
            </p>
            <h2
              style={{ textWrap: 'balance' }}
              className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-10"
            >
              Continuous Growth, One Project at a Time
            </h2>

            <ol className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-[#D4AF37]/70 before:via-[#D4AF37]/30 before:to-transparent">
              {PORTFOLIO_CONFIG.journey.map((step, index) => (
                <motion.li
                  key={step.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.3),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative pl-12"
                >
                  {/* Step Marker */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-[#141414] border border-[#D4AF37]/60 flex items-center justify-center font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[#F5D77A]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="luxury-card rounded-xl p-5">
                    <h3 className="text-base font-semibold text-white mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#A0A0A0] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Right: Sophisticated Education Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37] uppercase mb-3">
              Education
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-white mb-6">
              Academic Foundation
            </h2>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl bg-[#141414] border border-[#D4AF37]/30 p-7 sm:p-8 shadow-[0_24px_60px_-24px_rgba(212,175,55,0.18)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0D0D0D] border border-[#D4AF37]/40 flex items-center justify-center text-[#F5D77A] mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>

              <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold text-white mb-2">
                {PORTFOLIO_CONFIG.education.institution}
              </h3>

              <p className="inline-flex items-center gap-1.5 text-sm text-[#F5D77A] mb-6">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>{PORTFOLIO_CONFIG.education.location}</span>
              </p>

              <div className="pt-5 border-t border-white/[0.08] space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#A0A0A0] mb-1">
                    Field of Interest
                  </p>
                  <p className="text-base font-medium text-white">
                    {PORTFOLIO_CONFIG.education.fieldOfInterest}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-[#A0A0A0]">
                  {PORTFOLIO_CONFIG.education.summary}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
