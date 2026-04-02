import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

export const LogoVideoSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate progress: 0 when top enters, 1 when bottom leaves
      const start = viewportHeight;
      const end = -rect.height;
      const current = rect.top;
      
      let progress = (start - current) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      if (video.duration) {
        video.currentTime = progress * video.duration;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={containerRef}
      id="logo-video" 
      className="relative h-[150vh] bg-bg"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-bg-alt">
        <video
          ref={videoRef}
          src="/video/dentist-teeth-video-centre-dentaire-vaillancourt-st-onge-logo.mp4"
          muted
          playsInline
          className="w-full h-full object-cover opacity-0 transition-opacity duration-1000"
          onCanPlay={(e) => (e.currentTarget.style.opacity = '1')}
          onError={(e) => {
            console.warn("Video failed to load, showing fallback.");
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Fallback if video is missing */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center p-12">
            <div className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center text-accent font-heading font-bold text-5xl mb-8 mx-auto border-4 border-accent/30">
              VS
            </div>
            <p className="text-accent font-nav uppercase tracking-[0.2em] opacity-40">
              Expérience Signature
            </p>
          </div>
        </div>
        
        {/* Overlay for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/20 via-transparent to-bg/20 pointer-events-none" />
      </div>
    </section>
  );

};
