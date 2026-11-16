import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import {
  Atom,
  Brain,
  Code2,
  GitBranch,
  Globe,
  Laptop,
  Layout,
  Palette,
  Puzzle,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Terminal,
} from 'lucide-react';
import type { SkillCategory, SkillItem } from '../config/portfolioConfig';
import {
  calculateAverageByCategory,
  filterSkillsByCategory,
} from '../utils/portfolioLogic';

const SKILL_ICONS = {
  code: Code2,
  terminal: Terminal,
  globe: Globe,
  palette: Palette,
  smartphone: Smartphone,
  atom: Atom,
  git: GitBranch,
  editor: Laptop,
  sparkles: Sparkles,
  layout: Layout,
  brain: Brain,
  puzzle: Puzzle,
};

const CATEGORIES: Array<SkillCategory | 'All'> = [
  'All',
  'Programming',
  'Web Development',
  'Tools',
  'Other Skills',
];

function AnimatedCounter({
  target,
  active,
}: {
  target: number;
  active: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (prefersReducedMotion || !active) {
      setDisplay(target);
      return;
    }

    let start = 0;
    const duration = 700;
    const startTime = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(start + (target - start) * eased);
      setDisplay(next);
      if (progress < 1) {
        raf = window.requestAnimationFrame(step);
      }
    };

    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [target, active, prefersReducedMotion]);

  return (
    <span className="font-[family-name:var(--font-mono)] tabular-nums text-sm font-semibold text-[#F5D77A]">
      {display}%
    </span>
  );
}

interface SkillsSectionProps {
  skills: SkillItem[];
  onOpenEditor: () => void;
}

export function SkillsSection({ skills, onOpenEditor }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    SkillCategory | 'All'
  >('All');
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  const visibleSkills = filterSkillsByCategory(skills, selectedCategory);
  const categoryAverage = calculateAverageByCategory(skills, selectedCategory);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 sm:py-28 bg-[#050505] border-t border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37] uppercase mb-3">
              Technical Skills
            </p>
            <h2
              style={{ textWrap: 'balance' }}
              className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3"
            >
              Skills &amp; Learning Progress
            </h2>
            <p className="text-sm sm:text-base text-[#A0A0A0] max-w-2xl">
              Editable self-assessment estimates reflecting my current focus and
              hands-on learning across programming, web design, and AI tools—not
              verified professional benchmarks.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenEditor}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#141414] border border-[#D4AF37]/40 text-sm font-medium text-[#F5D77A] hover:border-[#F5D77A] hover:bg-[#D4AF37]/10 transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Edit Skill Estimates</span>
          </button>
        </div>

        {/* Category Filter Tabs + Category Average Readout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
          <div
            role="tablist"
            aria-label="Filter skills by category"
            className="flex flex-wrap items-center gap-2"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                    active
                      ? 'gold-gradient-bg text-[#050505] font-semibold'
                      : 'bg-[#141414] text-[#A0A0A0] border border-white/[0.08] hover:text-white hover:border-[#D4AF37]/35'
                  }`}
                >
                  {category === 'All' ? 'All Skills' : category}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-[#A0A0A0]">
            <span>{visibleSkills.length} tracked skills</span>
            <span aria-hidden="true">·</span>
            <span>
              Estimate mean:{' '}
              <strong className="font-[family-name:var(--font-mono)] tabular-nums text-[#F5D77A]">
                {categoryAverage}%
              </strong>
            </span>
          </div>
        </div>

        {/* Skills Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleSkills.map((skill, index) => {
            const Icon = SKILL_ICONS[skill.iconKey];
            const barWidth = inView || prefersReducedMotion ? skill.percentage : 0;

            return (
              <motion.div
                key={skill.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(index * 0.04, 0.3),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="luxury-card rounded-xl p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#0D0D0D] border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-[#A0A0A0] truncate">
                        {skill.category}
                      </p>
                    </div>
                  </div>

                  <AnimatedCounter
                    target={skill.percentage}
                    active={inView}
                  />
                </div>

                {/* Progress Track */}
                <div
                  role="progressbar"
                  aria-label={`${skill.name} self-assessment estimate`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={skill.percentage}
                  className="h-2.5 w-full rounded-full bg-[#0D0D0D] border border-white/[0.06] overflow-hidden"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: barWidth / 100 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.85,
                      delay: prefersReducedMotion ? 0 : 0.08 + index * 0.03,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: 'left center' }}
                    className="h-full w-full rounded-full bg-gradient-to-r from-[#8E6F1E] via-[#D4AF37] to-[#F5D77A]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
