import React from 'react';
import clinicExteriorHero from '@/DentalContent/Images/Ouside of the building/clinic-exterior-front-signage-01.jpg';
import clinicLogo from '@/DentalContent/Images/Logo/clinic-logo-primary.png';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './Button';
import { clinicData } from '../content/clinic';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col items-center justify-center bg-bg-dark text-bg-inverse overflow-hidden pt-20">
      {/* Background Image (Exterior) */}
      <div className="absolute inset-0 opacity-40">
        <img
          src={clinicExteriorHero}
          alt=""
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center gap-8 -translate-y-12 md:-translate-y-24">
        <h1 className="flex justify-center items-center max-w-6xl w-full px-6 py-6 sm:px-10 sm:py-8 md:py-10 bg-white text-bg-dark rounded-[2rem] shadow-lg ring-1 ring-black/10">
          <span className="sr-only">{t.hero.tagline}</span>
          <img
            src={clinicLogo}
            alt=""
            width={900}
            height={260}
            decoding="async"
            className="w-full max-w-[min(56rem,calc(100vw-3rem))] h-auto object-contain object-center [filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.12))]"
          />
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
