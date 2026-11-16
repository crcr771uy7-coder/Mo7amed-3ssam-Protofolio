import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDownRight, Mail, MapPin, User } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolioConfig';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  const titles = PORTFOLIO_CONFIG.hero.typingTitles;
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(titles[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Smooth typing animation cycling through developer roles
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(titles[0]);
      return;
    }

    const currentFullTitle = titles[titleIndex];
    let delay = isDeleting ? 42 : 78;

    if (!isDeleting && displayedText === currentFullTitle) {
      delay = 1900;
    } else if (isDeleting && displayedText === '') {
      delay = 280;
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting && displayedText === currentFullTitle) {
        setIsDeleting(true);
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % titles.length);
      } else if (isDeleting) {
        setDisplayedText(currentFullTitle.slice(0, displayedText.length - 1));
      } else {
        setDisplayedText(currentFullTitle.slice(0, displayedText.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [displayedText, isDeleting, titleIndex, titles, prefersReducedMotion]);

  // Subtle floating ambient golden particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    const particles: Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
    }> = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const width = canvas.clientWidth || 1200;
    const height = canvas.clientHeight || 800;

    for (let i = 0; i < 28; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.9 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -0.12 - Math.random() * 0.24,
        alpha: 0.14 + Math.random() * 0.34,
      });
    }

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-16 sm:pt-28 sm:pb-24 overflow-hidden bg-[#050505]"
    >
      {/* Subtle Ambient Background Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 right-[-10%] w-[540px] h-[540px] rounded-full bg-[#D4AF37]/[0.07] blur-[140px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[460px] h-[460px] rounded-full bg-[#F5D77A]/[0.04] blur-[140px]" />
      </div>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-80"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Brand Typography & Introduction */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Animated Status Indicator (luxury gold kinetic emblem, no green pulsing dot) */}
            <div className="inline-flex items-center gap-3 mb-6 self-start">
              <motion.span
                aria-hidden="true"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { rotate: [45, 135, 225, 315, 405] }
                }
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="w-2.5 h-2.5 border border-[#F5D77A] bg-[#D4AF37]/25 inline-block shrink-0"
              />
              <span className="text-xs sm:text-sm font-medium tracking-wide text-[#F5D77A]">
                {PORTFOLIO_CONFIG.brand.statusIndicator}
              </span>
              <span aria-hidden="true" className="text-[#A0A0A0]/50">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#A0A0A0]">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                {PORTFOLIO_CONFIG.brand.location}
              </span>
            </div>

            {/* Name */}
            <p className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-medium tracking-wide text-[#F5D77A] mb-3">
              {PORTFOLIO_CONFIG.brand.name}
            </p>

            {/* Main Hero Headline */}
            <h1
              style={{ textWrap: 'balance' }}
              className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.06] tracking-tight text-white mb-6"
            >
              {PORTFOLIO_CONFIG.hero.headline}
            </h1>

            {/* Typing Animation Role Line */}
            <div className="flex items-center gap-3 mb-6 min-h-[2rem]">
              <span className="text-sm text-[#A0A0A0]">Exploring as</span>
              <span
                aria-live="polite"
                className="font-[family-name:var(--font-mono)] text-sm sm:text-base font-medium text-[#F5D77A]"
              >
                {displayedText}
                <span
                  aria-hidden="true"
                  className="inline-block w-0.5 h-4 ml-1 bg-[#D4AF37] align-middle animate-pulse"
                />
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg leading-relaxed text-[#A0A0A0] max-w-2xl mb-8">
              {PORTFOLIO_CONFIG.hero.subtitle}
            </p>

            {/* Two Primary Interactive Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-7 py-3 rounded-lg gold-gradient-bg text-[#050505] text-sm font-semibold tracking-wide hover:brightness-110 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D77A]"
              >
                <span>Explore My Projects</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-7 py-3 rounded-lg bg-[#141414] border border-[#D4AF37]/40 text-white text-sm font-semibold tracking-wide hover:border-[#F5D77A] hover:text-[#F5D77A] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>Contact Me</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Authentic Personal Photograph Showcase */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex items-center justify-center"
          >
            <div className="relative w-full max-w-[420px] lg:max-w-none lg:h-full min-h-[420px]">
              {/* Soft Golden Glow Behind Portrait */}
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#D4AF37]/20 via-transparent to-[#F5D77A]/10 blur-2xl opacity-75"
              />

              {/* Portrait Container */}
              <div className="relative h-full w-full rounded-2xl overflow-hidden bg-[#0D0D0D] border border-[#D4AF37]/35 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col">
                <div className="relative flex-1 min-h-[380px] sm:min-h-[430px] overflow-hidden bg-[#0A0A0A]">
                  {!imageFailed ? (
                    <img
                      src={PORTFOLIO_CONFIG.brand.portraitPath}
                      alt={PORTFOLIO_CONFIG.brand.portraitAlt}
                      referrerPolicy="no-referrer"
                      onError={() => setImageFailed(true)}
                      style={{ transformOrigin: '48% 82%' }}
                      className="w-full h-full object-cover object-[48%_80%] scale-[1.22]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#141414] to-[#050505] text-[#A0A0A0] p-6 text-center">
                      <User className="w-12 h-12 text-[#D4AF37]" />
                      <p className="font-[family-name:var(--font-display)] text-2xl text-white">
                        {PORTFOLIO_CONFIG.brand.name}
                      </p>
                    </div>
                  )}

                  {/* Subtle edge vignette blending portrait into dark luxury frame */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,transparent_48%,rgba(5,5,5,0.68)_100%)]"
                  />
                </div>

                {/* Recessed Identity Footer Strip (never overlaps portrait) */}
                <div className="px-5 py-4 bg-[#111111] border-t border-[#D4AF37]/20">
                  <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                    {PORTFOLIO_CONFIG.brand.name}
                  </p>
                  <p className="text-xs text-[#F5D77A] mt-0.5">
                    Aspiring Software Developer · Python &amp; Web Developer · AI Explorer
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-width Role Strip Below Hero Split */}
        <div className="mt-14 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-[#A0A0A0]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {PORTFOLIO_CONFIG.hero.roles.map((role, index) => (
              <span key={role} className="inline-flex items-center gap-4">
                <span className="text-white/90">{role}</span>
                {index < PORTFOLIO_CONFIG.hero.roles.length - 1 && (
                  <span aria-hidden="true" className="text-[#D4AF37]/60">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
          <span className="text-[#D4AF37] font-medium">
            WE Applied Technology School · Menofia
          </span>
        </div>
      </div>
    </section>
  );
}
