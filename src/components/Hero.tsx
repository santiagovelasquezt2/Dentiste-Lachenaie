import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  type MotionStyle,
  type MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import clinicExteriorHero from '@/DentalContent/Images/Ouside of the building/clinic-exterior-front-signage-01.jpg';
import { useLanguage } from '../context/LanguageContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../lib/utils';
import { Button } from './Button';

const HERO_VIDEO_SRC = `${import.meta.env.BASE_URL}assets/hero-reveal.mp4`;
const DESKTOP_QUERY = '(min-width: 768px)';
/** Horizontal nudge of seam + title; keep 0 for a centered 50/50 split at rest. */
const INITIAL_SPLIT_OFFSET_PX = 0;
/** Pin height: extra viewport scroll while the hero is sticky. */
const HERO_PIN_VH = 380;
/**
 * Share of that pin range used for the horizontal reveal (0→1). The remainder is scroll spent
 * only on the full-bleed video (no document "moving on") before the pin releases.
 */
const REVEAL_FRACTION = 0.48;
/** The split title should disappear much faster than the video reveal. */
const TITLE_FADE_FRACTION = 0.16;
const TITLE_FADE_EDGE_PCT = 12;
/**
 * White|dark boundary on the hero title (`90deg` gradient), as % of the heading box width.
 * **50** = centered on the viewport midline (matches photo|video seam at rest).
 */
const HERO_TITLE_SPLIT_AT_PCT = 50;
/**
 * scrollYProgress value at which the title is fully gone (opacity 0, mask collapsed).
 * Derived from TITLE_FADE_FRACTION × REVEAL_FRACTION so both gates fire at the same moment.
 */
const SLOGAN_ENTRY_SCROLL = TITLE_FADE_FRACTION * REVEAL_FRACTION;
/**
 * Starting translateX: pushes the text's left edge just past the container's right clip boundary
 * so the very first character enters from the right edge as scroll begins.
 */
const SLOGAN_START_X_VW = 100;
/** End translateX: continues sliding left through the remainder of the hero pin range. */
const SLOGAN_END_X_VW = -60;
/** The slogan finishes its slide exactly as the pinned hero releases. */
const SLOGAN_EXIT_SCROLL = 1;
const heroSloganBaseClass =
  'font-display whitespace-nowrap font-normal tracking-[-0.055em] text-black drop-shadow-[0_2px_20px_rgba(255,255,255,0.65)]';
const heroSloganDesktopClass =
  'origin-center scale-y-[1.25] pt-[0.28em] pb-[0.42em] text-[clamp(4.59375rem,7.65625vw,12.8625rem)] leading-[1.12]';
const heroSloganMobileClass = 'origin-center scale-y-[1.1] text-[2.75625rem] leading-[1.12]';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  /**
   * Only track sectionProgress in React state — used only for the slogan
   * visibility gate (changes at discrete thresholds, not every frame).
   */
  const [sectionProgress, setSectionProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  /** Single scroll listener — only for the discrete gate checks. */
  useMotionValueEvent(scrollYProgress, 'change', setSectionProgress);

  useEffect(() => {
    if (!isDesktop) return;
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {});
  }, [isDesktop]);

  // ── Motion values — drive CSS directly, zero React re-renders on scroll ────

  /** Core reveal progress (0→1 over REVEAL_FRACTION of scroll range). */
  const stripTransform = useTransform(scrollYProgress, (latest) => {
    if (!isDesktop || prefersReducedMotion) return 'translate3d(-25%, 0, 0)';
    const rev = Math.min(1, latest / REVEAL_FRACTION);
    const pan = 25 + rev * 25;
    const offset = (1 - rev) * INITIAL_SPLIT_OFFSET_PX;
    const seam = Math.min(16, Math.max(0, (rev - 0.82) / 0.18) * 16);
    return `translate3d(calc(-${pan}% + ${offset}px - ${seam}px), 0, 0)`;
  });

  const splitTitleOpacity = useTransform(scrollYProgress, (latest) => {
    if (!isDesktop || prefersReducedMotion) return 1;
    const rev = Math.min(1, latest / REVEAL_FRACTION);
    const tfp = Math.min(1, rev / TITLE_FADE_FRACTION);
    return Math.max(0, 1 - tfp * 0.95);
  });

  const splitTitleMaskImage = useTransform(scrollYProgress, (latest) => {
    if (!isDesktop || prefersReducedMotion) {
      return `linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 88%, rgba(255,255,255,0) 100%, rgba(255,255,255,0) 100%)`;
    }
    const rev = Math.min(1, latest / REVEAL_FRACTION);
    const tfp = Math.min(1, rev / TITLE_FADE_FRACTION);
    const revealPct = Math.max(0, 100 - tfp * 100);
    const edgePct = Math.max(0, revealPct - TITLE_FADE_EDGE_PCT);
    return `linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) ${edgePct}%, rgba(255,255,255,0) ${revealPct}%, rgba(255,255,255,0) 100%)`;
  });

  const splitTitleTransform = useTransform(scrollYProgress, (latest) => {
    if (!isDesktop || prefersReducedMotion) return 'translate3d(0, -50%, 0) scale(1)';
    const rev = Math.min(1, latest / REVEAL_FRACTION);
    const offset = (1 - rev) * INITIAL_SPLIT_OFFSET_PX;
    const translateY = rev * 28;
    const scale = 1 - rev * 0.05;
    return `translate3d(${offset}px, calc(-50% + ${translateY}px), 0) scale(${scale})`;
  });

  const sloganOpacity = useTransform(scrollYProgress, (latest) => {
    if (prefersReducedMotion) return 1;
    return latest >= SLOGAN_ENTRY_SCROLL ? 1 : 0;
  });

  // ── Gate logic (React state — only changes at scroll thresholds) ───────────

  const stillInHeroSection = sectionProgress < 0.985;
  const sloganVisible = stillInHeroSection && sectionProgress >= SLOGAN_ENTRY_SCROLL;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate scroll-mt-24 overflow-x-clip bg-white"
    >
      {isDesktop ? (
        <div className="relative" style={{ height: `${HERO_PIN_VH}vh` }}>
          <div className="sticky top-0 h-screen overflow-x-clip overflow-y-visible bg-[#f8f4ee]">
            <motion.div
              className="flex h-full w-[200vw] will-change-transform"
              style={{ transform: stripTransform }}
            >
              <motion.div className="relative flex h-full w-screen items-center overflow-hidden bg-[#112133] text-white">
                <div className="absolute inset-0 overflow-hidden" aria-hidden>
                  <img
                    src={clinicExteriorHero}
                    alt=""
                    decoding="async"
                    fetchPriority="high"
                    className="absolute left-1/2 top-1/2 h-[115%] w-[115%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-[52%_36%] contrast-[1.04] saturate-[0.92] sm:object-[54%_34%] md:object-[50%_35%] lg:object-[36%_32%] xl:object-[34%_30%]"
                    aria-hidden
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f1720]/78 via-[#0f1720]/28 via-45% to-transparent to-100%" />
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_58%_45%,transparent_20%,rgba(15,23,32,0.22)_100%)] mix-blend-multiply"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f1720]/35"
                  aria-hidden
                />
              </motion.div>

              <motion.div className="relative flex h-full w-screen items-center overflow-hidden bg-black text-white">
                <video
                  ref={videoRef}
                  src={HERO_VIDEO_SRC}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="pointer-events-none absolute inset-0 z-[18] flex items-center justify-start overflow-hidden px-5 sm:px-8 md:px-10 lg:px-12">
                  <HeroSlidingSlogan
                    ariaHidden={!sloganVisible}
                    className={cn(
                      heroSloganBaseClass,
                      heroSloganDesktopClass,
                      'w-max max-w-none text-center [hyphens:none]',
                    )}
                    prefersReducedMotion={prefersReducedMotion}
                    scrollYProgress={scrollYProgress}
                    slogan={t.hero.slogan}
                    style={{ opacity: sloganOpacity }}
                  />
                </div>
              </motion.div>
            </motion.div>

            <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
              <motion.div
                className="absolute inset-x-0 top-1/2 overflow-visible px-4 py-[clamp(1.25rem,4.5vh,4rem)] text-center text-white sm:px-6 md:px-8 lg:px-12 xl:px-16"
                style={{
                  opacity: splitTitleOpacity,
                  maskImage: splitTitleMaskImage,
                  WebkitMaskImage: splitTitleMaskImage,
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskSize: '100% 100%',
                  WebkitMaskSize: '100% 100%',
                  transform: splitTitleTransform,
                }}
              >
                <h1
                  className="mx-auto block w-full origin-center scale-y-[1.25] pt-[0.28em] pb-[0.42em] text-center font-display text-[clamp(4.59375rem,7.65625vw,12.8625rem)] leading-[1.12] tracking-[-0.055em] [hyphens:none]"
                  style={{
                    backgroundImage: `linear-gradient(90deg, #ffffff 0%, #ffffff ${HERO_TITLE_SPLIT_AT_PCT}%, #0f1720 ${HERO_TITLE_SPLIT_AT_PCT}%, #0f1720 100%)`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  <span className="block">{t.hero.clinicNameTop}</span>
                  <span className="block whitespace-nowrap">{t.hero.clinicNameBottom}</span>
                </h1>
              </motion.div>
            </div>

          </div>
        </div>
      ) : (
        <div className="px-6 pb-16 pt-28">
          <div className="mx-auto flex max-w-4xl flex-col gap-8">
            <div className="space-y-5">
              <h1 className="origin-center scale-y-[1.1] font-display text-[2.75625rem] tracking-[-0.04em] text-balance text-[#1f1f1f] sm:text-[3.675rem]">
                <span className="block">{t.hero.clinicNameTop}</span>
                <span className="block">{t.hero.clinicNameBottom}</span>
              </h1>
              <p className="text-body-lg text-[#4f4f4f]">{t.hero.subheader}</p>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-black/8 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.15)]">
              <video
                src={HERO_VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="aspect-video w-full object-contain object-center"
              />
              <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-start overflow-hidden px-5 py-4 sm:px-8 sm:py-5">
                <HeroSlidingSlogan
                  ariaHidden={!sloganVisible}
                  className={cn(
                    heroSloganBaseClass,
                    heroSloganMobileClass,
                    'w-max max-w-none text-left',
                  )}
                  prefersReducedMotion={prefersReducedMotion}
                  scrollYProgress={scrollYProgress}
                  slogan={t.hero.slogan}
                  style={{ opacity: sloganOpacity }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                pill
                onClick={() => {
                  window.location.hash = '#appointment';
                }}
                className="bg-[#b0d64e] px-8 py-5 font-display text-lg font-normal tracking-[-0.02em] text-white normal-case shadow-lg shadow-[#b0d64e]/20 transition-all duration-300 hover:bg-[#9cbd42] sm:px-10 sm:text-xl"
              >
                {t.hero.cta}
              </Button>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/12 px-6 py-3 text-sm font-semibold text-[#1f1f1f]">
                <ArrowRight className="h-4 w-4 rotate-90" />
                Reveal the video
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

type HeroTeleprompterSloganProps = {
  ariaHidden?: boolean;
  className?: string;
  prefersReducedMotion: boolean;
  scrollYProgress: MotionValue<number>;
  slogan: string;
  style?: MotionStyle;
};

const HeroSlidingSlogan: React.FC<HeroTeleprompterSloganProps> = ({
  ariaHidden,
  className,
  prefersReducedMotion,
  scrollYProgress,
  slogan,
  style,
}) => {
  const normalizedSlogan = normalizeSlogan(slogan);
  const transform = useTransform(scrollYProgress, (latest) => {
    if (prefersReducedMotion) return 'translate3d(0vw, 0, 0)';
    // Keep the slogan moving until the hero finishes pinning, then let the
    // page continue scrolling down as the text exits the video frame.
    const slideProgress = clamp01(
      (latest - SLOGAN_ENTRY_SCROLL) / (SLOGAN_EXIT_SCROLL - SLOGAN_ENTRY_SCROLL),
    );
    const translateX = mix(SLOGAN_START_X_VW, SLOGAN_END_X_VW, slideProgress);
    return `translate3d(${translateX}vw, 0, 0)`;
  });

  return (
    <motion.h2
      aria-hidden={ariaHidden}
      aria-label={normalizedSlogan}
      className={className}
      style={{
        ...style,
        transform,
      }}
    >
      <span aria-hidden="true">{normalizedSlogan}</span>
    </motion.h2>
  );
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function normalizeSlogan(slogan: string): string {
  return slogan
    .replace(/\r\n/g, '\n')
    .replace(/\\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ');
}

function mix(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}
