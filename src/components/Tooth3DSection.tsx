import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ToothCanvas } from './ToothCanvas';

const AUTO_ADVANCE_MS = 2800;
const VISIBILITY_THRESHOLD = 0.4;

export const Tooth3DSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    if (!isPlaying || !isVisible || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setIndicatorCycle((current) => current + 1);
      setActiveIndex((current) => (current + 1) % displayImages.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [isPlaying, isVisible, prefersReducedMotion, displayImages.length]);

  return (
    <section
      ref={sectionRef}
      id="tooth-3d"
      className="relative overflow-hidden bg-bg-alt/70 py-14 md:py-14"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 15%, rgba(255,255,255,0.85), transparent 28%), radial-gradient(circle at 80% 0%, rgba(176,214,78,0.18), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.15))',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        aria-hidden
        style={{
          background:
            'linear-gradient(180deg, rgba(244,244,244,0) 0%, rgba(247,247,241,0.92) 100%)',
        }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-14">
          <div className="mx-auto w-full max-w-[620px] md:mx-0">
            <h2 className="text-section-title font-bold text-text">
              {t.tooth3d.title}
            </h2>
            <p className="mt-4 max-w-[42rem] text-base leading-relaxed text-text-light md:text-lg">
              {t.tooth3d.body}
            </p>

            <div className="mt-8 w-full max-w-[500px]">
              <div className="rounded-[1.6rem] bg-[#cfcfcf] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.2rem] bg-[#bfbfbf]">
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
                  <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_22%,transparent_78%,rgba(0,0,0,0.08))]"
                    aria-hidden
                  />
                </div>
              </div>

              <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying((current) => !current)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-teams text-text-inverse shadow-[0_12px_24px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:scale-105 active:scale-95"
                  aria-label={isPlaying ? t.tooth3d.pause : t.tooth3d.resume}
                >
                  {isPlaying && !prefersReducedMotion ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
                </button>

                <div className="flex min-h-11 items-center rounded-full bg-bg-teams px-4 py-3 shadow-[0_12px_24px_rgba(0,0,0,0.28)]">
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
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
                          className={`relative h-2 overflow-hidden rounded-full bg-white/25 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isActive ? 'w-7' : 'w-2 hover:bg-white/45'
                          }`}
                        >
                          {isActive && (
                            <span
                              className="carousel-indicator-fill absolute inset-y-0 left-0 block w-full rounded-full bg-white"
                              style={{ ['--indicator-duration' as string]: `${AUTO_ADVANCE_MS}ms` }}
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

          <div className="relative mx-auto h-[240px] w-full max-w-[560px] sm:h-[340px] md:h-[520px]">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.65),rgba(255,255,255,0.1)_55%,transparent_80%)]" />
            <div className="relative h-full w-full">
              <ToothCanvas />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
