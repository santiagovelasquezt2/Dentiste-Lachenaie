import React, { useLayoutEffect, useRef } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import { HoursContourPattern } from './HoursContourPattern';

export const HoursSection: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /** `clamp: false` avoids Framer attaching scroll-driven WAAPI to these transforms (can desync vs real progress). */
  const panelOpacity = useTransform(scrollYProgress, [0, 0.14, 0.16, 1], [0, 0, 1, 1], { clamp: false });
  const panelWidth = useTransform(
    scrollYProgress,
    [0, 0.14, 0.3, 0.48, 1],
    ['0rem', '0rem', '44rem', '100vw', '100vw'],
    { clamp: false }
  );
  const panelHeight = useTransform(
    scrollYProgress,
    [0, 0.14, 0.3, 0.48, 1],
    ['0rem', '0rem', '12rem', '100dvh', '100dvh'],
    { clamp: false }
  );
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

  // #region agent log
  const dbgLast = useRef(0);
  useLayoutEffect(() => {
    const sid = 'a76245';
    const ep = 'http://127.0.0.1:7516/ingest/8d447b25-2b2c-4cbb-b15f-8fbee55e32bb';
    const send = () => {
      const el = containerRef.current;
      const ov = document.querySelector('[data-hours-overlay]');
      const p = scrollYProgress.get();
      fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': sid },
        body: JSON.stringify({
          sessionId: sid,
          hypothesisId: 'H2',
          location: 'HoursSection.tsx:layout',
          message: 'mount/layout sample',
          data: {
            sectionOffsetH: el?.offsetHeight ?? null,
            rectTop: el?.getBoundingClientRect().top ?? null,
            scrollY: typeof window !== 'undefined' ? window.scrollY : null,
            hash: typeof window !== 'undefined' ? window.location.hash : null,
            scrollYProgress: p,
            titleLen: t.hours.title?.length ?? 0,
            panelOp: panelOpacity.get(),
            hoursOverlayOp: hoursOverlayOpacity.get(),
            contentOp: contentOpacity.get(),
            computedOverlayOpacity:
              ov && typeof getComputedStyle !== 'undefined' ? getComputedStyle(ov as Element).opacity : null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    };
    send();
    requestAnimationFrame(() => requestAnimationFrame(send));
  }, [t.hours.title]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const now = Date.now();
    if (now - dbgLast.current < 280) return;
    dbgLast.current = now;
    const sid = 'a76245';
    const ep = 'http://127.0.0.1:7516/ingest/8d447b25-2b2c-4cbb-b15f-8fbee55e32bb';
    const el = document.querySelector('[data-hours-overlay]');
    const computed = el && typeof getComputedStyle !== 'undefined' ? getComputedStyle(el as Element).opacity : null;
    fetch(ep, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': sid },
      body: JSON.stringify({
        sessionId: sid,
        hypothesisId: 'H1',
        location: 'HoursSection.tsx:scroll',
        message: 'scrollYProgress',
        data: {
          v,
          panelOp: panelOpacity.get(),
          hoursOverlayOp: hoursOverlayOpacity.get(),
          contentOp: contentOpacity.get(),
          panelW: typeof panelWidth.get === 'function' ? panelWidth.get() : null,
          panelH: typeof panelHeight.get === 'function' ? panelHeight.get() : null,
          computedOverlayOpacity: computed,
          overlayInDom: !!el,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  });
  // #endregion

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
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div className="absolute inset-0 bg-[#E7F1E3]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.42),_transparent_56%)]" />

        <motion.div
          style={{
            opacity: panelOpacity,
            width: panelWidth,
            height: panelHeight,
            borderRadius: panelRadius,
            boxShadow: panelShadow,
          }}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-[#062A1D]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(9,55,40,0.98),rgba(4,31,22,1))]" />
          <HoursContourPattern className="hours-pattern hours-pattern-slow absolute inset-[-12%] h-[124%] w-[124%] stroke-white/6 stroke-[2] fill-none" />
          <HoursContourPattern className="hours-pattern hours-pattern-fast absolute inset-[-18%] h-[136%] w-[136%] stroke-[#E7F1E3]/3 stroke-[1.5] fill-none" />
        </motion.div>

        <motion.div
          data-hours-overlay
          style={{ opacity: hoursOverlayOpacity }}
          className="pointer-events-none absolute inset-0 z-[25] flex items-center justify-center px-6 sm:px-10"
        >
          <h2 className="text-center text-[clamp(2.25rem,6.5vw,4.5rem)] font-bold leading-none tracking-[-0.05em] text-black">
            {t.hours.title}
          </h2>
        </motion.div>

        <motion.div
          style={{ opacity: contentOpacity }}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4 sm:px-6 md:px-10"
        >
          <motion.div
            style={{ pointerEvents: contentPointerEvents as any }}
            className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-[#FBFDF8] text-[#17352D] shadow-[0_28px_80px_rgba(2,33,24,0.24)] lg:rounded-[2.5rem]"
          >
            <motion.div
              style={{ opacity: cardBorderOpacity }}
              className="absolute inset-0 rounded-[inherit] border border-white/40"
            />

            <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="relative overflow-hidden bg-[#082F22] p-8 text-[#F7FAF5] sm:p-10 md:p-12">
                <HoursContourPattern className="hours-pattern hours-pattern-slow absolute inset-[-18%] h-[136%] w-[136%] stroke-white/6 stroke-[2] fill-none" />

                <div className="relative z-10 max-w-md">
                  <p className="text-nav text-white/70">{t.hours.scheduleLabel}</p>
                  <h3 className="mt-5 text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[0.98] tracking-[-0.04em] text-white">
                    {t.hours.title}
                  </h3>
                  <p className="mt-6 text-base leading-relaxed text-white md:text-lg">
                    {t.hours.description}
                  </p>

                  <div className="mt-8 flex items-start gap-3 rounded-[1.25rem] border border-white/12 bg-[#174736] px-5 py-4 text-left">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#B0D64E]" />
                    <span className="text-sm leading-relaxed text-white md:text-base">
                      {clinicData.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FBFDF8] p-8 sm:p-10 md:p-12">
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
                        <span className="text-right font-mono text-sm text-[#17352D] md:text-base">
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
    </section>
  );
};
