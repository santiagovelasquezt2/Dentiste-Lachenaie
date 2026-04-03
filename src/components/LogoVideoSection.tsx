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
  const [quoteVisible, setQuoteVisible] = useState(false);

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
  }, [videoError]);

  return (
    <section
      ref={sectionRef}
      id="logo-video"
      className="relative scroll-mt-20 bg-bg-alt py-12 md:py-20"
      aria-label="Signature experience video"
    >
      <div className="container mx-auto flex flex-col items-center px-6">
        {!videoError && (
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(31,41,55,0.12)]">
            <video
              ref={videoRef}
              src={teethVideo}
              muted
              playsInline
              loop
              preload="auto"
              tabIndex={-1}
              className="relative z-10 h-auto max-h-[85vh] w-full object-contain opacity-0 transition-opacity duration-700"
              onCanPlay={(e) => {
                e.currentTarget.style.opacity = '1';
                tryPlay();
              }}
              onError={() => {
                console.warn('Signature video failed to load; showing fallback.');
                setVideoError(true);
              }}
            />

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[42%] bg-gradient-to-t from-black/46 via-black/12 to-transparent"
              aria-hidden
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-end px-6 pb-8 text-right md:px-10 md:pb-14">
              <div
                className={[
                  'max-w-[15rem] rounded-[20px] border border-white/12 bg-white/8 px-4 py-3 text-right backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.14)]',
                  'font-nav text-[clamp(1rem,1.8vw,1.45rem)] font-light leading-[1.08] tracking-[0.04em] text-white/82',
                  'transform-gpu transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  quoteVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                ].join(' ')}
                lang={language === 'fr' ? 'fr-CA' : 'en-CA'}
              >
                <h2 className="text-balance">
                  <span className="block text-[0.64rem] uppercase tracking-[0.28em] text-white/48">
                    {t.logoVideo.lead}
                  </span>
                  <span className="mt-1 block text-[0.92em] text-white/68">
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
              <p className="font-nav uppercase tracking-[0.2em] text-accent opacity-40">
                Expérience Signature
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
