import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './Button';
import { clinicData } from '../content/clinic';
import { cn } from '../lib/utils';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    const words = titleRef.current.innerText.split(' ');
    titleRef.current.innerHTML = words
      .map((word, i) => `<span class="inline-block opacity-0 translate-y-4 transition-all duration-700" style="transition-delay: ${i * 100}ms">${word}</span>`)
      .join(' ');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const spans = entry.target.querySelectorAll('span');
            spans.forEach((span) => {
              span.classList.remove('opacity-0', 'translate-y-4');
              span.classList.add('opacity-100', 'translate-y-0');
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, [t.hero.tagline]);

  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col items-center justify-center bg-bg-dark text-bg-inverse overflow-hidden pt-20">
      {/* Background Image (Exterior) */}
      <div className="absolute inset-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop" 
          alt="Clinic Exterior" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center gap-8">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-bg-dark font-heading font-bold text-3xl mb-4 shadow-lg">
          VS
        </div>

        
        <h1 
          ref={titleRef}
          className="text-hero font-bold max-w-5xl"
        >
          {t.hero.tagline}
        </h1>

        <p className="text-xl md:text-2xl font-body text-bg-inverse/80 max-w-2xl">
          {t.hero.body}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Button size="lg" onClick={() => window.location.href = '#appointment'}>
            {t.hero.cta}
          </Button>
          <a 
            href={`tel:${clinicData.phone.replace(/\D/g, '')}`}
            className="text-xl font-mono text-accent hover:text-accent-dark transition-colors"
          >
            {clinicData.phone}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-accent rounded-full" />
        </div>
      </div>
    </section>
  );
};
