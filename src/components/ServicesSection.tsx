import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../lib/utils';
import { ArrowRight, ChevronRight, X } from 'lucide-react';

/** Bump `?v=` when swapping icons so browsers pick up new assignments (SVG URLs are easy to cache). */
const SERVICE_ICON_V = '2';

/** SVGs from client assets (svgrepo), filenames match service themes */
const serviceIconSrc = {
  orthodontics: `/assets/services/braces-teeth-svgrepo-com.svg?v=${SERVICE_ICON_V}`,
  prevention: `/assets/services/teeth-protection-svgrepo-com.svg?v=${SERVICE_ICON_V}`,
  pediatric: `/assets/services/toothbrush-and-paste-svgrepo-com.svg?v=${SERVICE_ICON_V}`,
  restoration: `/assets/services/build-fix-repair-svgrepo-com.svg?v=${SERVICE_ICON_V}`,
  implants: `/assets/services/dentist-tools-dental-svgrepo-com.svg?v=${SERVICE_ICON_V}`,
  emergency: `/assets/services/urgency-time-urgent-schedule-svgrepo-com.svg?v=${SERVICE_ICON_V}`,
  surgery: `/assets/services/dental-surgery.svg?v=${SERVICE_ICON_V}`,
  cosmetic: `/assets/services/dentist-2-svgrepo-com.svg?v=${SERVICE_ICON_V}`,
} as const;

type ServiceId = keyof typeof serviceIconSrc;

function ServiceIcon({ id, className }: { id: ServiceId; className?: string }) {
  return (
    <img
      src={serviceIconSrc[id]}
      alt=""
      className={cn('object-contain', className)}
    />
  );
}
type Language = 'fr' | 'en';

const serviceDetails: Record<Language, Record<ServiceId, {
  eyebrow: string;
  description: string;
  highlights: string[];
}>> = {
  fr: {
    orthodontics: {
      eyebrow: 'Sourire aligné',
      description: "Les traitements orthodontiques améliorent l'alignement, la fonction et la stabilité de votre sourire avec une approche adaptée à votre rythme de vie.",
      highlights: [
        'Évaluation complète de la position des dents et de la mâchoire',
        'Plans de traitement adaptés aux enfants, ados et adultes',
        'Suivi régulier pour des résultats précis et durables',
      ],
    },
    prevention: {
      eyebrow: 'Base de santé',
      description: "Les soins préventifs réduisent les risques de caries et de maladies des gencives tout en gardant votre bouche en santé sur le long terme.",
      highlights: [
        'Nettoyage professionnel et dépistage',
        "Conseils personnalisés d'hygiène",
        'Interventions simples, rapides et régulières',
      ],
    },
    pediatric: {
      eyebrow: 'Petits patients',
      description: "Nous créons une expérience rassurante pour les enfants afin de développer de bonnes habitudes dès la première visite.",
      highlights: [
        'Approche douce et rassurante',
        'Prévention adaptée aux jeunes sourires',
        'Explications simples pour les parents et les enfants',
      ],
    },
    restoration: {
      eyebrow: 'Réparer et protéger',
      description: "Les restaurations dentaires permettent de rebâtir la structure et l'apparence des dents abîmées ou fragilisées.",
      highlights: [
        'Obturations et réparations durables',
        "Matériaux choisis pour l'esthétique et la résistance",
        'Plans ciblés selon vos besoins',
      ],
    },
    implants: {
      eyebrow: 'Remplacement stable',
      description: 'Les implants et ponts aident à remplacer des dents manquantes avec une solution solide, fonctionnelle et naturelle.',
      highlights: [
        'Analyse personnalisée de votre situation',
        'Options de remplacement adaptées',
        'Priorité au confort, à la fonction et au résultat',
      ],
    },
    emergency: {
      eyebrow: 'Soulagement rapide',
      description: "En cas de douleur ou d'urgence dentaire, nous visons un accueil rapide pour limiter l'inconfort et stabiliser la situation.",
      highlights: [
        "Prise en charge prioritaire selon l'urgence",
        'Soulagement de la douleur et diagnostic ciblé',
        'Suivi pour éviter les complications',
      ],
    },
    surgery: {
      eyebrow: 'Procédures ciblées',
      description: "La chirurgie dentaire est planifiée avec précision pour traiter des situations plus complexes de façon sécuritaire.",
      highlights: [
        "Préparation claire avant l'intervention",
        'Procédure réalisée avec rigueur',
        'Consignes précises pour la récupération',
      ],
    },
    cosmetic: {
      eyebrow: 'Sourire harmonieux',
      description: "La dentisterie esthétique vise à améliorer l'apparence du sourire tout en respectant l'équilibre naturel de vos dents.",
      highlights: [
        'Solutions adaptées à votre objectif',
        "Accent sur l'harmonie et la naturalité",
        'Plan clair et progressif',
      ],
    },
  },
  en: {
    orthodontics: {
      eyebrow: 'Aligned smile',
      description: 'Orthodontic care improves alignment, function, and long-term stability with treatment that fits your lifestyle.',
      highlights: [
        'Full evaluation of teeth and jaw position',
        'Plans for children, teens, and adults',
        'Regular follow-up for accurate, lasting results',
      ],
    },
    prevention: {
      eyebrow: 'Health foundation',
      description: 'Preventive care reduces the risk of decay and gum disease while keeping your mouth healthy over time.',
      highlights: [
        'Professional cleaning and screening',
        'Personalized hygiene guidance',
        'Simple, regular interventions',
      ],
    },
    pediatric: {
      eyebrow: 'Little patients',
      description: 'We create a reassuring experience for children so they can build strong dental habits from the first visit.',
      highlights: [
        'Gentle, reassuring approach',
        'Prevention tailored to young smiles',
        'Clear explanations for parents and kids',
      ],
    },
    restoration: {
      eyebrow: 'Repair and protect',
      description: 'Restorative dentistry rebuilds the structure and appearance of damaged or weakened teeth.',
      highlights: [
        'Durable fillings and repairs',
        'Materials chosen for aesthetics and strength',
        'Targeted plans based on your needs',
      ],
    },
    implants: {
      eyebrow: 'Stable replacement',
      description: 'Implants and bridges replace missing teeth with a solution that feels solid, functional, and natural.',
      highlights: [
        'Personalized assessment of your situation',
        'Replacement options matched to your goals',
        'Focus on comfort, function, and outcome',
      ],
    },
    emergency: {
      eyebrow: 'Fast relief',
      description: 'For pain or urgent dental issues, we aim to help quickly so we can reduce discomfort and stabilize the situation.',
      highlights: [
        'Priority care based on urgency',
        'Pain relief and focused diagnosis',
        'Follow-up to prevent complications',
      ],
    },
    surgery: {
      eyebrow: 'Focused procedures',
      description: 'Dental surgery is planned carefully to treat more complex situations safely and efficiently.',
      highlights: [
        'Clear preparation before treatment',
        'Procedure delivered with precision',
        'Recovery instructions that are easy to follow',
      ],
    },
    cosmetic: {
      eyebrow: 'Harmonious smile',
      description: 'Cosmetic dentistry improves the look of your smile while keeping the result natural and balanced.',
      highlights: [
        'Solutions tailored to your goals',
        'Emphasis on harmony and natural results',
        'A clear, progressive treatment plan',
      ],
    },
  },
};

export const ServicesSection: React.FC = () => {
  const { t, language } = useLanguage();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [activeService, setActiveService] = useState<ServiceId | null>(null);

  const activeServiceData = useMemo(() => {
    if (!activeService) return null;
    return {
      title: t.services.items[activeService],
      icon: <ServiceIcon id={activeService} className="h-7 w-7 md:h-8 md:w-8" />,
      ...serviceDetails[language as Language][activeService],
    };
  }, [activeService, language, t.services.items]);

  useEffect(() => {
    const horizontal = horizontalRef.current;
    if (!horizontal) return;

    if (isMobile) {
      horizontal.style.transform = '';
      return;
    }

    const container = containerRef.current;
    if (!container) return;

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

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!activeService) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeService]);

  useFocusTrap({
    active: activeService !== null,
    containerRef: dialogRef,
    initialFocusRef: closeButtonRef,
    onEscape: () => setActiveService(null),
  });

  return (
    <section 
      ref={containerRef}
      id="services" 
      className={cn(
        'relative scroll-mt-24 bg-bg-teams',
        isMobile ? 'py-20' : 'h-[300vh]'
      )}
    >
      <div className={cn(
        isMobile
          ? 'container mx-auto px-4 sm:px-6'
          : 'sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden'
      )}>
        <div className={cn(
          'container mx-auto mb-12',
          isMobile ? 'px-0 mb-10' : 'px-6'
        )}>
          <h2 className="text-section-title font-heading font-semibold text-bg-inverse">
            {t.services.title}
          </h2>
        </div>

        <div 
          ref={horizontalRef}
          className={cn(
            'transition-transform duration-100 ease-out',
            isMobile
              ? 'grid gap-4'
              : 'flex gap-8 px-6 md:px-[10vw]'
          )}
        >
          {clinicData.services.map((service) => (
            <button 
              key={service.id}
              type="button"
              onClick={() => setActiveService(service.id as ServiceId)}
              className={cn(
                'group flex flex-col gap-6 rounded-2xl bg-white p-6 text-left shadow-xl transition-transform duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 md:p-12',
                isMobile ? 'w-full' : 'w-[300px] flex-shrink-0 md:w-[400px] hover:scale-[1.02]'
              )}
            >
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg-dark transition-colors duration-300">
                <ServiceIcon id={service.id as ServiceId} className="h-8 w-8" />
              </div>
              <h3 className="text-card-title md:text-3xl font-heading font-semibold text-text group-hover:text-accent transition-colors">
                {t.services.items[service.id as keyof typeof t.services.items]}
              </h3>
              <p className="text-base leading-relaxed text-text-light">
                {t.services.cardTeaser}
              </p>
              <div className="mt-auto pt-8 border-t border-bg-alt flex items-center justify-between">
                <span className="text-nav text-accent/90">
                  {t.services.learnMore}
                </span>
                <div className="w-10 h-10 border border-accent rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-bg-dark transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeServiceData && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden bg-black/55 px-4 py-4 backdrop-blur-md sm:items-center sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveService(null)}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-modal-title"
              aria-describedby="service-modal-description"
              tabIndex={-1}
              className="relative flex max-h-[calc(100svh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:rounded-[2rem]"
              initial={{ opacity: 0, scale: 0.92, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-accent via-[#c9d9af] to-[#f6c56a]" />

              <div className="relative flex flex-col">
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setActiveService(null)}
                  className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-bg-alt text-text-light transition-colors hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={t.services.closeDialog}
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-start gap-4 px-5 pt-5 pr-14 sm:px-6 sm:pt-6 md:px-10 md:pt-10">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                      {activeServiceData.icon}
                    </div>
                    <div>
                      <p className="mb-2 text-nav text-accent/90">
                        {activeServiceData.eyebrow}
                      </p>
                      <h3 id="service-modal-title" className="text-3xl md:text-4xl font-heading font-semibold leading-tight tracking-tight text-text">
                        {activeServiceData.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="mt-8 overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6 md:grid md:grid-cols-[1.2fr_0.8fr] md:gap-8 md:px-10 md:pb-10">
                  <div className="space-y-6">
                    <p id="service-modal-description" className="text-base md:text-lg text-text-light leading-relaxed">
                      {activeServiceData.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="#appointment"
                        onClick={() => setActiveService(null)}
                        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-nav uppercase tracking-[0.15em] text-bg-dark transition-transform hover:scale-[1.02]"
                      >
                        {t.services.bookAppointment}
                      </a>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.5rem] bg-bg-alt p-6 md:mt-0">
                    <p className="mb-4 text-nav text-text/60">
                      {t.services.whatToExpect}
                    </p>
                    <ul className="space-y-4">
                      {activeServiceData.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3 text-sm md:text-base text-text-light leading-relaxed">
                          <ArrowRight className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
