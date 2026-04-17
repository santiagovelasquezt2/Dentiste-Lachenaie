import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { ToothCanvas } from './ToothCanvas';
import { SECTION_HEADING_CLASS } from '../lib/sectionHeading';

const AUTO_ADVANCE_MS = 2800;
const VISIBILITY_THRESHOLD = 0.4;

export const Tooth3DSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const toothRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorCycle, setIndicatorCycle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const displayImages = useMemo(
    () => [
      {
        src: '/tool-dentist-display/grok-image-8f683b71-47ea-4c4e-a6dd-4e8c6ec5de27.png',
        alt: t.tooth3d.images.modelAndTool,
      },
      {
        src: '/tool-dentist-display/grok-image-0aafe2b4-2a3c-4f14-8877-03934595054a.png',
        alt: t.tooth3d.images.instruments,
      },
      {
        src: '/tool-dentist-display/grok-image-d2822071-ca53-4ad2-98c4-e0a54960ca6b.png',
        alt: t.tooth3d.images.aligner,
      },
      {
        src: '/tool-dentist-display/grok-image-9605161a-3f5c-4354-9f3f-14031207f894.png',
        alt: t.tooth3d.images.mold,
      },
      {
        src: '/tool-dentist-display/grok-image-32634553-9e61-4c79-afd3-e34802dc143f.png',
        alt: t.tooth3d.images.tools,
      },
      {
        src: '/tool-dentist-display/grok-image-691dc2b8-2956-4e62-8235-fe8515029d5a.png',
        alt: t.tooth3d.images.tweezers,
      },
    ] as const,
    [t.tooth3d.images]
  );

  const indicatorStates = useMemo(
    () => displayImages.map((_, index) => index === activeIndex),
    [activeIndex, displayImages]
  );

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

  return (
    <section
      ref={sectionRef}
      id="tooth-3d"
      className="relative overflow-x-clip overflow-y-visible bg-bg-teams pt-10 pb-16 md:pt-10 md:pb-20"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div
          ref={gridRef}
          className="grid gap-8 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:items-start md:gap-x-10 md:gap-y-10"
        >
          <div className="flex flex-col items-center gap-14 pt-2 md:gap-16 md:pt-4 lg:pt-5">
            <h2 className={cn('w-full text-left text-white md:max-w-[24rem]', SECTION_HEADING_CLASS)}>
              <span className="block whitespace-nowrap">{t.tooth3d.titleLine1}</span>
              <span className="mt-[0.14em] block whitespace-nowrap">{t.tooth3d.titleLine2}</span>
            </h2>

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
                          onClick={() => {
                            setIndicatorCycle((current) => current + 1);
                            setActiveIndex(index);
                            setIsPlaying(true);
                          }}
                          aria-label={t.tooth3d.selectImage.replace('{index}', String(index + 1))}
                          aria-current={isActive}
                          className={`relative h-1.5 overflow-hidden rounded-full bg-white/12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isActive ? 'w-5' : 'w-1.5 hover:bg-white/28'
                          }`}
                        >
                          {isActive && (
                            <span
                              className={cn(
                                'absolute inset-y-0 left-0 block w-full rounded-full bg-white',
                                !prefersReducedMotion && 'carousel-indicator-fill',
                              )}
                              onAnimationEnd={() => {
                                if (prefersReducedMotion || !isPlaying || !isVisible) return;
                                setIndicatorCycle((current) => current + 1);
                                setActiveIndex((current) => (current + 1) % displayImages.length);
                              }}
                              style={
                                prefersReducedMotion
                                  ? { transform: 'scaleX(1)' }
                                  : {
                                      ['--indicator-duration' as string]: `${AUTO_ADVANCE_MS}ms`,
                                      animationPlayState: isPlaying && isVisible ? 'running' : 'paused',
                                    }
                              }
                              aria-hidden
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={toothRef}
            className="relative mx-auto aspect-[4/6] w-full max-w-[11rem] md:mx-0 md:w-[11rem] md:max-w-[11rem] md:justify-self-end md:self-start md:translate-x-8 md:-translate-y-14 lg:translate-x-12 lg:-translate-y-16"
          >
            <div
              className="pointer-events-none absolute left-1/2 top-[8%] h-[58%] w-[88%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.62),rgba(255,255,255,0.1)_48%,transparent_76%)] blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-[14%] h-[68%] w-[92%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(176,214,78,0.12),rgba(176,214,78,0.05)_34%,transparent_68%)] blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 bottom-[8%] h-[16%] w-[54%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(76,94,35,0.16),rgba(76,94,35,0.06)_42%,transparent_72%)] blur-2xl"
              aria-hidden
            />
            <div className="relative h-full w-full overflow-visible">
              <div
                className="pointer-events-none absolute inset-x-[-10%] inset-y-[-10%] md:inset-x-[-8%] md:inset-y-[-8%]"
                aria-hidden
              >
                <ToothCanvas />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
