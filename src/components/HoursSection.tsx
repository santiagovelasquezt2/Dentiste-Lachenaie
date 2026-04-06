import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import { HoursContourPattern } from './HoursContourPattern';

const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress;

export const HoursSection: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1, height: 1, rootFontSize: 16 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useLayoutEffect(() => {
    const viewportEl = viewportRef.current;
    if (!viewportEl) return;

    const updateViewportSize = () => {
      const { width, height } = viewportEl.getBoundingClientRect();
      const rootFontSize =
        typeof window !== 'undefined'
          ? Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16
          : 16;

      setViewportSize({
        width: Math.max(width, 1),
        height: Math.max(height, 1),
        rootFontSize,
      });
    };

    updateViewportSize();

    const resizeObserver = new ResizeObserver(updateViewportSize);
    resizeObserver.observe(viewportEl);
    window.addEventListener('resize', updateViewportSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateViewportSize);
    };
  }, []);

  const panelOpacity = useTransform(scrollYProgress, [0, 0.14, 0.16, 1], [0, 0, 1, 1], { clamp: false });
  const panelScaleX = useTransform(scrollYProgress, (v) => {
    const collapsedScale = (44 * viewportSize.rootFontSize) / viewportSize.width;

    if (v <= 0.14) return 0;
    if (v <= 0.3) return lerp(0, collapsedScale, (v - 0.14) / 0.16);
    if (v <= 0.48) return lerp(collapsedScale, 1, (v - 0.3) / 0.18);
    return 1;
  });
  const panelScaleY = useTransform(scrollYProgress, (v) => {
    const collapsedScale = (12 * viewportSize.rootFontSize) / viewportSize.height;

    if (v <= 0.14) return 0;
    if (v <= 0.3) return lerp(0, collapsedScale, (v - 0.14) / 0.16);
    if (v <= 0.48) return lerp(collapsedScale, 1, (v - 0.3) / 0.18);
    return 1;
  });
  const panelRadius = useTransform(
    scrollYProgress,
    [0, 0.14, 0.3, 0.48, 1],
    ['0rem', '0rem', '0.5rem', '0rem', '0rem'],
    { clamp: false }
  );
  const panelShadow = useTransform(
    scrollYProgress,
    [0, 0.14, 0.3, 0.48],
    ['0px 0px 0px rgba(2, 33, 24, 0)', '0px 0px 0px rgba(2, 33, 24, 0)', '0px 30px 80px rgba(2, 33, 24, 0.16)', '0px 0px 0px rgba(2, 33, 24, 0)'],
    { clamp: false }
  );

  /** Full-screen green panel reaches 100vw / 100dvh at ~0.48; hold title until then, then fade. */
  const hoursOverlayOpacity = useTransform(scrollYProgress, [0, 0.48, 0.54, 1], [1, 1, 0, 0], { clamp: false });

  const contentOpacity = useTransform(scrollYProgress, (v) => {
    if (v < 0.72) return 0;
    if (v >= 0.8) return 1;
    return (v - 0.72) / 0.08;
  });
  const contentPointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.8 ? 'auto' : 'none'));
  const cardBorderOpacity = useTransform(scrollYProgress, (v) => {
    if (v < 0.74) return 0;
    if (v >= 0.8) return 1;
    return (v - 0.74) / 0.06;
  });

  const days = [
    { key: 'monday', label: t.hours.monday },
    { key: 'tuesday', label: t.hours.tuesday },
    { key: 'wednesday', label: t.hours.wednesday },
    { key: 'thursday', label: t.hours.thursday },
    { key: 'friday', label: t.hours.friday },
    { key: 'saturday', label: t.hours.saturday },
    { key: 'sunday', label: t.hours.sunday },
  ];

  return (
    <section
      ref={containerRef}
      id="hours"
      className="relative h-[320vh] overflow-clip bg-[#E7F1E3]"
    >
      <div ref={viewportRef} className="sticky top-0 h-[100dvh] overflow-hidden">
        <div className="absolute inset-0 bg-[#E7F1E3]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.42),_transparent_56%)]" />

        <motion.div
          style={{
            opacity: panelOpacity,
            scaleX: panelScaleX,
            scaleY: panelScaleY,
            borderRadius: panelRadius,
            boxShadow: panelShadow,
            willChange: 'transform, opacity, border-radius, box-shadow',
          }}
          className="absolute inset-0 z-10 origin-center overflow-hidden bg-[#B0D64E]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.38),transparent_44%),linear-gradient(135deg,rgba(196,228,109,0.98),rgba(176,214,78,0.98)_42%,rgba(140,176,55,1))]" />
          <HoursContourPattern className="hours-pattern hours-pattern-slow absolute inset-[-12%] h-[124%] w-[124%] stroke-[#17352D]/10 stroke-[2] fill-none" />
          <HoursContourPattern className="hours-pattern hours-pattern-fast absolute inset-[-18%] h-[136%] w-[136%] stroke-white/12 stroke-[1.5] fill-none" />
        </motion.div>

        <motion.div
          data-hours-overlay
          style={{ opacity: hoursOverlayOpacity }}
          className="pointer-events-none absolute inset-0 z-[25] flex items-center justify-center px-6 sm:px-10"
        >
          <h2 className="text-center text-section-title font-heading font-semibold leading-none tracking-[-0.04em] text-black">
            {t.hours.overlayTitle}
          </h2>
        </motion.div>

        <motion.div
          style={{ opacity: contentOpacity }}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4 sm:px-6 md:px-10"
        >
          <motion.div
            style={{ pointerEvents: contentPointerEvents as any }}
            className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white text-[#17352D] shadow-[0_24px_70px_rgba(2,33,24,0.14)] ring-1 ring-black/5 lg:rounded-[2.5rem]"
          >
            <motion.div
              style={{ opacity: cardBorderOpacity }}
              className="absolute inset-0 rounded-[inherit] border border-black/5"
            />

            <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="relative overflow-hidden bg-white p-8 text-[#17352D] sm:p-10 md:p-12 lg:border-r lg:border-black/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(176,214,78,0.08),transparent_52%)]" />

                <div className="relative z-10 max-w-md">
                  <p className="text-nav text-[#17352D]/55">{t.hours.scheduleLabel}</p>
                  <h3 className="mt-5 text-section-title font-heading font-semibold leading-[0.98] tracking-[-0.04em] text-[#17352D]">
                    {t.hours.cardTitle}
                  </h3>
                  <p className="mt-6 text-base leading-relaxed text-[#17352D]/72 md:text-lg">
                    {t.hours.description}
                  </p>

                  <div className="mt-8 flex items-start gap-3 rounded-[1.25rem] border border-black/5 bg-[#FAFAF7] px-5 py-4 text-left shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#B0D64E]" />
                    <span className="text-base leading-relaxed text-[#17352D]">
                      {clinicData.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 sm:p-10 md:p-12">
                <div className="space-y-4">
                  {days.map((day) => {
                    const value = clinicData.hours[day.key as keyof typeof clinicData.hours];
                    const displayValue = value === 'Fermé' || value === 'Closed' ? t.hours.closed : value;

                    return (
                      <div
                        key={day.key}
                        className="flex items-center justify-between gap-6 border-b border-[#17352D]/10 pb-4"
                      >
                        <span className="text-lg font-medium text-[#17352D] md:text-xl">
                          {day.label}
                        </span>
                        <span className="text-right font-body tabular-nums text-base text-[#17352D] md:text-lg">
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      {/* Nav target: lands at the point where the full hours card is in view, skipping the early reveal state. */}
      <div
        id="hours-card"
        className="pointer-events-none absolute left-0 h-px w-full"
        style={{ top: '176vh' }}
        aria-hidden
      />
    </section>
  );
};
