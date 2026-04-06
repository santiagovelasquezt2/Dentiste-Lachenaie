import React, { useCallback, useEffect, useRef, useState } from 'react';
import teethVideo from '@/DentalContent/Video/Dentist Teeth Video centre dentaire vaillancourt st-onge logo (1).mp4';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

/** How much of the section must be visible before autoplay runs. */
const VISIBILITY_THRESHOLD = 0.2;

/**
 * Signature clip: loops at native frame rate while the section is on screen; pauses when scrolled away.
 */
export const LogoVideoSection: React.FC = () => {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const [videoError, setVideoError] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  /** First frame is usable — Safari and lazy off-screen videos often skip `canplay` but fire `loadeddata`. */
  const [videoReady, setVideoReady] = useState(false);

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !visibleRef.current) return;
    void video.play().catch(() => {});
  }, []);

  const revealAndTryPlay = useCallback(() => {
    setVideoReady(true);
    tryPlay();
  }, [tryPlay]);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || videoError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }
        setQuoteVisible(true);
        tryPlay();
      },
      { threshold: VISIBILITY_THRESHOLD, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [videoError, tryPlay]);

  return (
    <section
      ref={sectionRef}
      id="logo-video"
      className="relative scroll-mt-20 bg-bg-alt py-12 md:py-20"
      aria-label={t.logoVideo.sectionLabel}
    >
      <div className="container mx-auto flex flex-col items-center px-6">
        {!videoError && (
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_28px_90px_rgba(31,41,55,0.14)] ring-1 ring-black/5">
            <video
              ref={videoRef}
              src={teethVideo}
              muted
              playsInline
              loop
              preload="auto"
              tabIndex={-1}
              className={cn(
                'relative z-10 h-auto max-h-[85vh] w-full object-contain transition-opacity duration-700',
                videoReady ? 'opacity-100' : 'opacity-0'
              )}
              onLoadedData={revealAndTryPlay}
              onCanPlay={revealAndTryPlay}
              onError={() => {
                console.warn('Signature video failed to load; showing fallback.');
                setVideoError(true);
              }}
            />

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[46%] bg-gradient-to-t from-black/52 via-black/16 to-transparent"
              aria-hidden
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-5 pb-6 md:px-8 md:pb-10">
              <div
                className={[
                  'max-w-[36rem] rounded-[26px] border border-white/14 bg-white/10 px-5 py-4 text-center backdrop-blur-2xl shadow-[0_18px_54px_rgba(0,0,0,0.18)]',
                  'font-body text-white/88',
                  'transform-gpu transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  quoteVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                ].join(' ')}
                lang={language === 'fr' ? 'fr-CA' : 'en-CA'}
              >
                <h2 className="text-balance">
                  <span className="text-overline block text-white/54">
                    {t.logoVideo.lead}
                  </span>
                  <span className="text-title mt-2 block text-white/92">
                    {t.logoVideo.quote}
                  </span>
                </h2>
              </div>
            </div>
          </div>
        )}

        {videoError && (
          <div className="relative z-10 flex min-h-[40vh] w-full max-w-5xl flex-col items-center justify-center overflow-hidden rounded-[28px] bg-white py-12 shadow-[0_24px_80px_rgba(31,41,55,0.12)]">
            <div className="text-center p-12">
              <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border-4 border-accent/30 bg-accent/20 text-5xl font-bold font-heading text-accent">
                VS
              </div>
              <p className="text-nav text-accent opacity-40">
                {t.logoVideo.fallbackLabel}
              </p>
            </div>
          </div>
        )}

      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-dark/10 via-transparent to-bg/10"
        aria-hidden
      />
    </section>
  );
};
