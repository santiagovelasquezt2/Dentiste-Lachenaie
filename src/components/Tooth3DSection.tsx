import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { ToothCanvas } from './ToothCanvas';
import { SECTION_HEADING_CLASS } from '../lib/sectionHeading';

const AUTO_ADVANCE_MS = 2800;
const VISIBILITY_THRESHOLD = 0.4;
const TOOL_DISPLAY_BASE = `${import.meta.env.BASE_URL}tool-dentist-display`;

export const Tooth3DSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const indicatorProgressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorCycle, setIndicatorCycle] = useState(0);
  const [indicatorProgress, setIndicatorProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.28,
  });
  const lineFill = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const displayImages = useMemo(
    () => [
      {
        src: `${TOOL_DISPLAY_BASE}/grok-image-8f683b71-47ea-4c4e-a6dd-4e8c6ec5de27.png`,
        alt: t.tooth3d.images.modelAndTool,
      },
      {
        src: `${TOOL_DISPLAY_BASE}/grok-image-0aafe2b4-2a3c-4f14-8877-03934595054a.jpeg`,
        alt: t.tooth3d.images.instruments,
      },
      {
        src: `${TOOL_DISPLAY_BASE}/grok-image-d2822071-ca53-4ad2-98c4-e0a54960ca6b.png`,
        alt: t.tooth3d.images.aligner,
      },
      {
        src: `${TOOL_DISPLAY_BASE}/grok-image-9605161a-3f5c-4354-9f3f-14031207f894.png`,
        alt: t.tooth3d.images.mold,
      },
      {
        src: `${TOOL_DISPLAY_BASE}/grok-image-32634553-9e61-4c79-afd3-e34802dc143f.png`,
        alt: t.tooth3d.images.tools,
      },
      {
        src: `${TOOL_DISPLAY_BASE}/grok-image-691dc2b8-2956-4e62-8235-fe8515029d5a.png`,
        alt: t.tooth3d.images.tweezers,
      },
    ] as const,
    [t.tooth3d.images]
  );

  const indicatorStates = useMemo(
    () => displayImages.map((_, index) => index === activeIndex),
    [activeIndex, displayImages]
  );

  const resetIndicatorProgress = (value = 0) => {
    indicatorProgressRef.current = value;
    setIndicatorProgress(value);
    lastTimestampRef.current = null;
  };

  const selectImage = (index: number) => {
    setIndicatorCycle((current) => current + 1);
    setActiveIndex(index);
    setIsPlaying(true);
    resetIndicatorProgress();
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: VISIBILITY_THRESHOLD, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      resetIndicatorProgress(1);
      return;
    }

    resetIndicatorProgress();
  }, [activeIndex, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !isPlaying || !isVisible) {
      lastTimestampRef.current = null;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      return;
    }

    const tick = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      const nextProgress = Math.min(indicatorProgressRef.current + elapsed / AUTO_ADVANCE_MS, 1);
      indicatorProgressRef.current = nextProgress;
      setIndicatorProgress(nextProgress);

      if (nextProgress >= 1) {
        resetIndicatorProgress();
        setIndicatorCycle((current) => current + 1);
        setActiveIndex((current) => (current + 1) % displayImages.length);
        animationFrameRef.current = null;
        return;
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [activeIndex, displayImages.length, isPlaying, isVisible, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="tooth-3d"
      className="relative overflow-x-clip overflow-y-visible bg-bg-teams py-12 md:py-16"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="w-full max-w-[30rem]">
              <h2 className={cn('w-full text-left text-white', SECTION_HEADING_CLASS)}>
                <span className="block whitespace-nowrap">{t.tooth3d.titleLine1}</span>
                <span className="mt-[0.14em] block whitespace-nowrap">{t.tooth3d.titleLine2}</span>
              </h2>
              <p className="mt-5 max-w-[25rem] text-sm leading-6 tracking-[-0.01em] text-white/62 sm:text-[0.96rem]">
                {t.tooth3d.intro}
              </p>
            </div>

            <div className="relative hidden h-[12rem] w-[9rem] shrink-0 self-start lg:block lg:-translate-y-4 xl:h-[14rem] xl:w-[10rem] xl:-translate-y-6">
              <div
                className="pointer-events-none absolute left-1/2 top-[8%] h-[58%] w-[88%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.56),rgba(255,255,255,0.08)_48%,transparent_76%)] blur-2xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-[14%] h-[68%] w-[92%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(176,214,78,0.1),rgba(176,214,78,0.04)_34%,transparent_68%)] blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 bottom-[8%] h-[16%] w-[54%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(76,94,35,0.16),rgba(76,94,35,0.06)_42%,transparent_72%)] blur-2xl"
                aria-hidden
              />
              <div className="relative h-full w-full overflow-visible">
                <div
                  className="pointer-events-none absolute inset-x-[-10%] inset-y-[-10%] xl:inset-x-[-8%] xl:inset-y-[-8%]"
                  aria-hidden
                >
                  <ToothCanvas />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-x-12 xl:gap-x-16">
            <div className="flex flex-col items-center lg:items-start">
              <div ref={carouselRef} className="w-full max-w-[24rem]">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1rem] border border-white/6 bg-[#1f1e1d] shadow-[0_22px_60px_rgba(0,0,0,0.38)]">
                  {displayImages.map((image, index) => (
                    <img
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        indicatorStates[index]
                          ? 'scale-100 opacity-100'
                          : 'scale-[1.03] opacity-0'
                      }`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      aria-hidden={!indicatorStates[index]}
                    />
                  ))}
                </div>

                <div className="mt-3 flex w-full flex-wrap items-center justify-center gap-1.5 md:mt-3.5 md:gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((current) => !current)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-lime text-bg-dark shadow-[0_4px_9px_rgba(176,214,78,0.28)] transition-transform duration-300 hover:scale-105 active:scale-95 md:h-8 md:w-8"
                    aria-label={isPlaying ? t.tooth3d.pause : t.tooth3d.resume}
                  >
                    {isPlaying && !prefersReducedMotion ? <Pause className="h-[0.72rem] w-[0.72rem] md:h-[0.82rem] md:w-[0.82rem]" /> : <Play className="h-[0.72rem] w-[0.72rem] translate-x-[1px] md:h-[0.82rem] md:w-[0.82rem]" />}
                  </button>

                  <div className="flex min-h-9 items-center rounded-full bg-[#2f2d2b] px-3 py-1.5 shadow-[0_6px_12px_rgba(0,0,0,0.28)] md:min-h-10 md:px-3.5 md:py-2">
                    <div className="flex flex-wrap items-center justify-center gap-1 md:gap-1.5">
                      {displayImages.map((image, index) => {
                        const isActive = indicatorStates[index];
                        const indicatorKey = isActive ? `${image.src}-${indicatorCycle}` : image.src;

                        return (
                          <button
                            key={indicatorKey}
                            type="button"
                            onClick={() => selectImage(index)}
                            aria-label={t.tooth3d.selectImage.replace('{index}', String(index + 1))}
                            aria-current={isActive}
                            aria-pressed={isActive}
                            className="group flex h-4 w-4 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2f2d2b] md:h-[1.1rem] md:w-[1.1rem]"
                          >
                            <span
                              className={cn(
                                'relative block h-1.5 overflow-hidden rounded-full bg-white/12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                                isActive ? 'w-5' : 'w-1.5 group-hover:bg-white/28',
                              )}
                            >
                              {isActive && (
                                <span
                                  className="absolute inset-y-0 left-0 block w-full origin-left rounded-full bg-brand-lime shadow-[0_0_10px_rgba(176,214,78,0.22)]"
                                  style={
                                    prefersReducedMotion
                                      ? { transform: 'scaleX(1)' }
                                      : {
                                          transform: `scaleX(${indicatorProgress})`,
                                          transformOrigin: 'left center',
                                        }
                                  }
                                  aria-hidden
                                />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[34rem] justify-center self-center lg:mx-0 lg:max-w-[46rem] lg:justify-end lg:translate-x-20 xl:translate-x-32">
              <div className="grid w-full grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-5 sm:grid-cols-[1.75rem_minmax(0,1fr)] sm:gap-7">
                <div className="relative flex self-stretch justify-center pt-1">
                  <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/14" aria-hidden />
                  <motion.div
                    aria-hidden
                    className="absolute left-1/2 top-0 w-px -translate-x-1/2 origin-top rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(176,214,78,0.82))] shadow-[0_0_18px_rgba(176,214,78,0.22)]"
                    style={{
                      height: prefersReducedMotion ? '100%' : lineFill,
                      opacity: prefersReducedMotion ? 1 : undefined,
                    }}
                  />
                </div>

                <div className="space-y-10 pt-1 sm:space-y-12">
                  <p className="max-w-[29rem] font-body text-[clamp(1.7rem,2.65vw,3.2rem)] leading-[1.16] tracking-[-0.05em] text-white text-balance">
                    {t.tooth3d.story.lead}
                  </p>

                  <p className="max-w-[24rem] font-body text-[clamp(1rem,1.15vw,1.14rem)] leading-[1.72] tracking-[-0.018em] text-white/72">
                    {t.tooth3d.story.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
