import React, { useEffect, useRef, useState } from 'react';
import teethVideo from '@/DentalContent/Video/Dentist Teeth Video centre dentaire vaillancourt st-onge logo (1).mp4';
import { useLanguage } from '../context/LanguageContext';

/** How much of the section must be visible before playback runs. */
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

  const tryPlay = () => {
    const video = videoRef.current;
    if (!video || !visibleRef.current) return;
    void video.play().catch(() => {});
  };

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
        tryPlay();
      },
      { threshold: VISIBILITY_THRESHOLD, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [videoError]);

  return (
    <section
      ref={sectionRef}
      id="logo-video"
      className="relative scroll-mt-20 bg-bg-alt py-16 md:py-24"
      aria-label="Signature experience video"
    >
      <div className="container mx-auto flex flex-col items-center px-6">
        {!videoError && (
          <video
            ref={videoRef}
            src={teethVideo}
            muted
            playsInline
            loop
            preload="auto"
            tabIndex={-1}
            className="relative z-10 w-auto max-w-full max-h-[85vh] overflow-hidden rounded-2xl object-contain opacity-0 transition-opacity duration-700"
            onCanPlay={(e) => {
              e.currentTarget.style.opacity = '1';
              tryPlay();
            }}
            onError={() => {
              console.warn('Signature video failed to load; showing fallback.');
              setVideoError(true);
            }}
          />
        )}

        {videoError && (
          <div className="relative z-10 flex min-h-[40vh] w-full max-w-2xl flex-col items-center justify-center py-12">
            <div className="text-center p-12">
              <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border-4 border-accent/30 bg-accent/20 text-5xl font-bold font-heading text-accent">
                VS
              </div>
              <p className="font-nav uppercase tracking-[0.2em] text-accent opacity-40">
                Expérience Signature
              </p>
            </div>
          </div>
        )}

        <p
          className="relative z-10 mt-8 max-w-5xl text-center font-['Segoe_UI_Emoji'] text-3xl font-medium leading-snug tracking-tight text-text sm:text-4xl md:mt-10 md:text-5xl lg:text-6xl"
          lang={language === 'fr' ? 'fr-CA' : 'en-CA'}
        >
          <span className="font-heading font-bold text-accent" aria-hidden>
            -{' '}
          </span>
          {t.logoVideo.quote}
        </p>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-dark/10 via-transparent to-bg/10"
        aria-hidden
      />
    </section>
  );
};
