import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import { cn } from '../lib/utils';
import { Smile, Shield, Baby, Wrench, Activity, Stethoscope, Syringe, Sparkles } from 'lucide-react';

const serviceIcons: Record<string, React.ReactNode> = {
  orthodontics: <Smile className="w-6 h-6" />,
  prevention: <Shield className="w-6 h-6" />,
  pediatric: <Baby className="w-6 h-6" />,
  restoration: <Wrench className="w-6 h-6" />,
  implants: <Activity className="w-6 h-6" />,
  emergency: <Stethoscope className="w-6 h-6" />,
  surgery: <Syringe className="w-6 h-6" />,
  cosmetic: <Sparkles className="w-6 h-6" />,
};

export const ServicesSection: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const horizontal = horizontalRef.current;
    if (!container || !horizontal) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate progress within the section
      const totalScroll = rect.height - viewportHeight;
      const currentScroll = -rect.top;
      
      let progress = currentScroll / totalScroll;
      progress = Math.max(0, Math.min(1, progress));

      const scrollWidth = horizontal.scrollWidth - window.innerWidth;
      horizontal.style.transform = `translateX(${-progress * scrollWidth}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={containerRef}
      id="services" 
      className="relative h-[300vh] bg-bg-dark"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-section-title text-bg-inverse font-bold">
            {t.services.title}
          </h2>
        </div>

        <div 
          ref={horizontalRef}
          className="flex gap-8 px-6 md:px-[10vw] transition-transform duration-100 ease-out"
        >
          {clinicData.services.map((service, index) => (
            <div 
              key={service.id}
              className="flex-shrink-0 w-[300px] md:w-[400px] bg-white rounded-2xl p-8 md:p-12 shadow-xl flex flex-col gap-6 group hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg-dark transition-colors duration-300">
                {serviceIcons[service.id] || <Sparkles className="w-6 h-6" />}
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-text group-hover:text-accent transition-colors">
                {t.services.items[service.id as keyof typeof t.services.items]}
              </h3>
              <p className="text-text-light leading-relaxed">
                Soins spécialisés et personnalisés pour votre santé buccodentaire.
              </p>
              <div className="mt-auto pt-8 border-t border-bg-alt flex items-center justify-between">
                <span className="text-nav text-accent font-bold">En savoir plus</span>
                <div className="w-10 h-10 border border-accent rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-bg-dark transition-all">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
