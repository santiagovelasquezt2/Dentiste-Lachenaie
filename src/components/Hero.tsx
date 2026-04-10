import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import clinicExteriorHero from '@/DentalContent/Images/Ouside of the building/clinic-exterior-front-signage-01.jpg';
import { useLanguage } from '../context/LanguageContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Button } from './Button';

const HERO_VIDEO_SRC = `${import.meta.env.BASE_URL}assets/hero-reveal.mp4`;
const DESKTOP_QUERY = '(min-width: 768px)';
const INITIAL_SPLIT_OFFSET_PX = 410;
/** Pin height: extra viewport scroll while the hero is sticky. */
const HERO_PIN_VH = 380;
/**
 * Share of that pin range used for the horizontal reveal (0→1). The remainder is scroll spent
 * only on the full-bleed video (no document “moving on”) before the pin releases.
 */
const REVEAL_FRACTION = 0.48;
/** The split title should disappear much faster than the video reveal. */
const TITLE_FADE_FRACTION = 0.16;
const TITLE_FADE_EDGE_PCT = 12;

// #region agent log
const DEBUG_LOG_ENDPOINT = 'http://127.0.0.1:7573/ingest/20ff4847-cd1d-41af-aa0a-6e2f30cd5f25';
const DEBUG_SESSION_ID = '0e348b';
const emitDebugLog = (
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>,
  runId = 'run1',
) => {
  fetch(DEBUG_LOG_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': DEBUG_SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION_ID,
      runId,
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
};
// #endregion

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [revealProgress, setRevealProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const applyHeroScrollProgress = useCallback(
    (latest: number) => {
      if (!isDesktop) {
        setRevealProgress(0);
        return;
      }

      if (prefersReducedMotion) {
        setRevealProgress(0);
        return;
      }

      const t = Math.min(1, latest / REVEAL_FRACTION);
      setRevealProgress(t);
    },
    [isDesktop, prefersReducedMotion],
  );

  useMotionValueEvent(scrollYProgress, 'change', applyHeroScrollProgress);

  useEffect(() => {
    if (!isDesktop) return;

    const video = videoRef.current;
    if (!video) return;

    void video.play().catch(() => {});
  }, [isDesktop]);

  useEffect(() => {
    applyHeroScrollProgress(scrollYProgress.get());
  }, [applyHeroScrollProgress, scrollYProgress]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.18,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  /** Pan the 200vw strip as % of its own width: -25% = split, -50% = video only (no vw rounding drift). */
  const panPercent = 25 + revealProgress * 25;
  /** Start with the seam slightly right of center, then ease it back as the video takes over. */
  const splitOffsetPx = (1 - revealProgress) * INITIAL_SPLIT_OFFSET_PX;
  /** Extra left shift only near the end — clears subpixel / anti-aliasing bleed from the photo panel. */
  const seamNudgePx = Math.min(16, Math.max(0, (revealProgress - 0.82) / 0.18) * 16);

  const titleFadeProgress = Math.min(1, revealProgress / TITLE_FADE_FRACTION);
  const titleRevealPct = Math.max(0, 100 - titleFadeProgress * 100);
  const titleFadeEdgePct = Math.max(0, titleRevealPct - TITLE_FADE_EDGE_PCT);
  const splitTitleOpacity = Math.max(0, 1 - titleFadeProgress * 0.95);
  const splitTitleMaskImage = `linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) ${titleFadeEdgePct}%, rgba(255, 255, 255, 0) ${titleRevealPct}%, rgba(255, 255, 255, 0) 100%)`;
  const splitTitleTranslateY = revealProgress * 28;
  const splitTitleScale = 1 - revealProgress * 0.05;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    emitDebugLog('H1', 'src/components/Hero.tsx:branch', 'Hero branch and overlay state', {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      isDesktop,
      prefersReducedMotion,
      activeBranch: isDesktop ? 'desktop' : 'mobile',
      photoOverlayPresent: Boolean(document.querySelector('[data-debug-hero-photo-overlay]')),
    });
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!isDesktop) return;

    emitDebugLog('H2', 'src/components/Hero.tsx:revealProgress', 'Hero desktop scroll state', {
      revealProgress,
      panPercent,
      splitOffsetPx,
      seamNudgePx,
    });
  }, [isDesktop, panPercent, revealProgress, seamNudgePx, splitOffsetPx]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate scroll-mt-24 overflow-x-clip bg-white"
    >
      {isDesktop ? (
        <div className="relative" style={{ height: `${HERO_PIN_VH}vh` }}>
          <div className="sticky top-0 h-screen overflow-hidden bg-[#f8f4ee]">
            <motion.div
              className="flex h-full w-[200vw] will-change-transform"
              style={{
                transform: `translate3d(calc(-${panPercent}% + ${splitOffsetPx}px - ${seamNudgePx}px), 0, 0)`,
              }}
            >
              <motion.div className="relative flex h-full w-screen items-center overflow-hidden bg-[#112133] text-white">
                <motion.img
                  src={clinicExteriorHero}
                  alt={t.hero.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover object-[56%_44%] sm:object-[60%_42%] lg:object-[32%_40%]"
                  aria-hidden
                />
                <div
                  data-debug-hero-photo-overlay
                  className="absolute inset-0 bg-gradient-to-r from-[#0f1720]/72 via-[#0f1720]/30 to-transparent"
                />

                <div className="relative z-10 flex h-full w-full items-start justify-start px-6 pb-20 pt-28 sm:px-10 sm:pt-32 md:px-12 md:pt-36 lg:px-16 lg:pt-40 xl:px-24">
                  <motion.div
                    className="max-w-md space-y-6 text-left"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    style={{ opacity: 1 - revealProgress * 0.35 }}
                  >
                    <motion.p variants={itemVariants} className="text-overline text-white/60">
                      {t.hero.eyebrow}
                    </motion.p>

                    <motion.p variants={itemVariants} className="text-body-lg text-white/84">
                      {t.hero.subheader}
                    </motion.p>

                    <motion.div
                      variants={itemVariants}
                      className="flex flex-wrap items-center justify-start gap-4"
                    >
                      <Button
                        size="lg"
                        pill
                        onClick={() => {
                          window.location.hash = '#appointment';
                        }}
                        className="bg-[#b0d64e] px-8 py-5 font-display text-lg font-normal tracking-[-0.02em] text-white normal-case shadow-lg shadow-[#b0d64e]/20 transition-all duration-300 hover:bg-[#9cbd42] sm:px-10 sm:text-xl lg:px-12 lg:py-7 lg:text-[1.35rem]"
                      >
                        {t.hero.cta}
                      </Button>

                      <div className="hero-caption-surface inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white/85">
                        <ArrowRight className="h-4 w-4 rotate-90" />
                        Scroll to reveal video
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div className="relative flex h-full w-screen items-center overflow-hidden bg-black text-white">
                <video
                  ref={videoRef}
                  src={HERO_VIDEO_SRC}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </motion.div>
            </motion.div>

            <div className="pointer-events-none absolute inset-0 z-20">
              <motion.div
                className="absolute inset-x-0 top-1/2 overflow-visible px-4 text-center text-white sm:px-6 md:px-8 lg:px-12 xl:px-16"
                style={{
                  opacity: splitTitleOpacity,
                  maskImage: splitTitleMaskImage,
                  WebkitMaskImage: splitTitleMaskImage,
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskSize: '100% 100%',
                  WebkitMaskSize: '100% 100%',
                  transform: `translate3d(${splitOffsetPx}px, calc(-50% + ${splitTitleTranslateY}px), 0) scale(${splitTitleScale})`,
                }}
              >
                <h1 className="mx-auto block w-full max-w-[min(99.5vw,104rem)] bg-[linear-gradient(90deg,#ffffff_0_50%,#0f1720_50%_100%)] bg-clip-text py-[0.28em] text-center font-display text-[clamp(3.75rem,6.25vw,10.5rem)] leading-[1.06] tracking-[-0.055em] text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [text-shadow:0_20px_50px_rgba(0,0,0,0.2)] [hyphens:none]">
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
              <h1 className="font-display text-4xl tracking-[-0.04em] text-balance text-[#1f1f1f] sm:text-5xl">
                <span className="block">{t.hero.clinicNameTop}</span>
                <span className="block">{t.hero.clinicNameBottom}</span>
              </h1>
              <p className="text-body-lg text-[#4f4f4f]">{t.hero.subheader}</p>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-black/8 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.15)]">
              <video
                src={HERO_VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="aspect-video w-full object-contain object-center"
              />
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
