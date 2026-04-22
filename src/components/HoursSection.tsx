import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { HoursContourPattern } from './HoursContourPattern';
import { cn } from '../lib/utils';
import { SECTION_HEADING_CLASS } from '../lib/sectionHeading';

const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress;
export const HoursSection: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  if (isMobile) {
    return <HoursSectionMobile t={t} />;
  }

  return <HoursSectionDesktop t={t} />;
};

const HoursSectionMobile = ({ t }: { t: ReturnType<typeof useLanguage>['t'] }) => {
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
    <section id="hours" className="relative scroll-mt-24 overflow-hidden bg-[#E7F1E3] py-20">
      <div id="hours-card" className="pointer-events-none absolute top-0 h-px w-full scroll-mt-24" aria-hidden />

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_56%)]" />
        <HoursContourPattern className="hours-pattern hours-pattern-slow absolute inset-[-12%] h-[124%] w-[124%] stroke-[#17352D]/10 stroke-[2] fill-none" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white text-[#17352D] shadow-[0_24px_70px_rgba(2,33,24,0.14)] ring-1 ring-black/5">
          <div className="bg-[linear-gradient(135deg,rgba(196,228,109,0.98),rgba(176,214,78,0.98)_42%,rgba(140,176,55,1))] px-6 py-10 text-[#17352D]">
            <p className="text-nav text-[#17352D]/60">{t.hours.scheduleLabel}</p>
            <h2 className={cn('mt-4 text-[#17352D]', SECTION_HEADING_CLASS)}>
              {t.hours.cardTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#17352D]/78">{t.hours.description}</p>
          </div>

          <div className="space-y-8 p-6">
            <div className="flex items-start gap-3 rounded-[1.25rem] border border-black/5 bg-[#FAFAF7] px-5 py-4 text-left shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#B0D64E]" />
              <span className="text-base leading-relaxed text-[#17352D]">{clinicData.address}</span>
            </div>

            <div className="space-y-4">
              {days.map((day) => {
                const value = clinicData.hours[day.key as keyof typeof clinicData.hours];
                const displayValue = value === 'Fermé' || value === 'Closed' ? t.hours.closed : value;

                return (
                  <div
                    key={day.key}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-[#17352D]/10 pb-4"
                  >
                    <span className="min-w-0 text-base font-medium text-[#17352D]">{day.label}</span>
                    <span className="max-w-[11rem] justify-self-end break-words text-right font-body text-sm leading-relaxed tabular-nums text-[#17352D]">
                      {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HoursSectionDesktop = ({ t }: { t: ReturnType<typeof useLanguage>['t'] }) => {
  const containerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const overlayTitleRef = useRef<HTMLHeadingElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1, height: 1, rootFontSize: 16 });
  const [overlayCenter, setOverlayCenter] = useState({ left: 0, top: 0 });
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

  useLayoutEffect(() => {
    const viewportEl = viewportRef.current;
    const overlayTitleEl = overlayTitleRef.current;
    if (!viewportEl || !overlayTitleEl) return;

    const updateOverlayCenter = () => {
      const viewportRect = viewportEl.getBoundingClientRect();
      const titleRect = overlayTitleEl.getBoundingClientRect();

      setOverlayCenter({
        left: titleRect.left - viewportRect.left + titleRect.width / 2,
        top: titleRect.top - viewportRect.top + titleRect.height / 2,
      });
    };

    updateOverlayCenter();

    const resizeObserver = new ResizeObserver(updateOverlayCenter);
    resizeObserver.observe(viewportEl);
    resizeObserver.observe(overlayTitleEl);
    window.addEventListener('resize', updateOverlayCenter);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateOverlayCenter);
    };
  }, [t.hours.overlayTitle]);

  const panelOpacity = useTransform(scrollYProgress, [0, 0.1, 0.14, 1], [0, 0, 1, 1], { clamp: false });
  const panelScaleX = useTransform(scrollYProgress, (v) => {
    const collapsedScale = (44 * viewportSize.rootFontSize) / viewportSize.width;

    if (v <= 0.12) return 0;
    if (v <= 0.28) return lerp(0, collapsedScale, (v - 0.12) / 0.16);
    if (v <= 0.46) return lerp(collapsedScale, 1, (v - 0.28) / 0.18);
    return 1;
  });
  const panelScaleY = useTransform(scrollYProgress, (v) => {
    const collapsedScale = (12 * viewportSize.rootFontSize) / viewportSize.height;

    if (v <= 0.12) return 0;
    if (v <= 0.28) return lerp(0, collapsedScale, (v - 0.12) / 0.16);
    if (v <= 0.46) return lerp(collapsedScale, 1, (v - 0.28) / 0.18);
    return 1;
  });
  const panelRadius = useTransform(
    scrollYProgress,
    [0, 0.12, 0.28, 0.46, 1],
    ['0rem', '0rem', '0.5rem', '0rem', '0rem'],
    { clamp: false }
  );
  const panelShadow = useTransform(
    scrollYProgress,
    [0, 0.12, 0.28, 0.46],
    ['0px 0px 0px rgba(2, 33, 24, 0)', '0px 0px 0px rgba(2, 33, 24, 0)', '0px 30px 80px rgba(2, 33, 24, 0.16)', '0px 0px 0px rgba(2, 33, 24, 0)'],
    { clamp: false }
  );

  const hoursOverlayOpacity = useTransform(scrollYProgress, [0, 0.38, 0.46, 1], [1, 1, 0, 0], { clamp: false });
  const contentOpacity = useTransform(scrollYProgress, (v) => {
    if (v < 0.54) return 0;
    if (v >= 0.68) return 1;
    return (v - 0.54) / 0.14;
  });
  const contentPointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.64 ? 'auto' : 'none'));
  const cardBorderOpacity = useTransform(scrollYProgress, (v) => {
    if (v < 0.58) return 0;
    if (v >= 0.7) return 1;
    return (v - 0.58) / 0.12;
  });
  const cardEnterY = useTransform(scrollYProgress, (v) => {
    const enterDistance = Math.min(viewportSize.height * 0.08, 88);

    if (v <= 0.52) return enterDistance;
    if (v >= 0.72) return 0;
    return lerp(enterDistance, 0, (v - 0.52) / 0.2);
  });
  const cardEnterScale = useTransform(scrollYProgress, (v) => {
    if (v <= 0.52) return 0.965;
    if (v >= 0.72) return 1;
    return lerp(0.965, 1, (v - 0.52) / 0.2);
  });
  const cardEnterBlur = useTransform(scrollYProgress, (v) => {
    if (v <= 0.52) return 'blur(10px)';
    if (v >= 0.72) return 'blur(0px)';
    const blur = lerp(10, 0, (v - 0.52) / 0.2);
    return `blur(${blur.toFixed(2)}px)`;
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
      className="relative h-[320vh] scroll-mt-24 overflow-clip bg-[#E7F1E3]"
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
            width: viewportSize.width,
            height: viewportSize.height,
            left: overlayCenter.left,
            top: overlayCenter.top,
            translateX: '-50%',
            translateY: '-50%',
            willChange: 'transform, opacity, border-radius, box-shadow',
          }}
          className="absolute z-10 origin-center overflow-hidden bg-[#B0D64E]"
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
          <h2 ref={overlayTitleRef} className={cn('text-center text-black', SECTION_HEADING_CLASS)}>
            {t.hours.overlayTitle}
          </h2>
        </motion.div>

        <motion.div
          style={{ opacity: contentOpacity }}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4 sm:px-6 md:px-10"
        >
          <motion.div
            style={{
              pointerEvents: contentPointerEvents as any,
              y: cardEnterY,
              scale: cardEnterScale,
              filter: cardEnterBlur,
              willChange: 'transform, opacity, filter',
            }}
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
                  <h3 className={cn('mt-5 text-[#17352D]', SECTION_HEADING_CLASS)}>
                    {t.hours.cardTitle}
                  </h3>
                  <p className="mt-6 text-base leading-relaxed text-[#17352D]/72 md:text-lg">
                    {t.hours.description}
                  </p>

                  <div className="mt-8 flex items-start gap-3 rounded-[1.25rem] border border-black/5 bg-[#FAFAF7] px-5 py-4 text-left shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#B0D64E]" />
                    <span className="text-base leading-relaxed text-[#17352D]">{clinicData.address}</span>
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
                        <span className="text-lg font-medium text-[#17352D] md:text-xl">{day.label}</span>
                        <span className="text-right font-body text-base tabular-nums text-[#17352D] md:text-lg">
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
      <div
        id="hours-card"
        className="pointer-events-none absolute left-0 h-px w-full scroll-mt-24"
        style={{ top: '176vh' }}
        aria-hidden
      />
    </section>
  );
};
