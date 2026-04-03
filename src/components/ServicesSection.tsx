import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import { cn } from '../lib/utils';
import { Activity, ArrowRight, Baby, ChevronRight, Shield, Smile, Sparkles, Stethoscope, Syringe, Wrench, X } from 'lucide-react';

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

type ServiceId = keyof typeof serviceIcons;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<ServiceId | null>(null);

  const activeServiceData = useMemo(() => {
    if (!activeService) return null;
    return {
      title: t.services.items[activeService],
      icon: serviceIcons[activeService] || <Sparkles className="w-6 h-6" />,
      ...serviceDetails[language as Language][activeService],
    };
  }, [activeService, language, t.services.items]);

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

  useEffect(() => {
    if (!activeService) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveService(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeService]);

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
          {clinicData.services.map((service) => (
            <button 
              key={service.id}
              type="button"
              onClick={() => setActiveService(service.id as ServiceId)}
              className="flex-shrink-0 w-[300px] md:w-[400px] bg-white rounded-2xl p-8 md:p-12 shadow-xl flex flex-col gap-6 group hover:scale-[1.02] transition-transform duration-500 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg-dark transition-colors duration-300">
                {serviceIcons[service.id] || <Sparkles className="w-6 h-6" />}
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-text group-hover:text-accent transition-colors">
                {t.services.items[service.id as keyof typeof t.services.items]}
              </h3>
              <p className="text-text-light leading-relaxed">
                {language === 'fr'
                  ? 'Soins spécialisés et personnalisés pour votre santé buccodentaire.'
                  : 'Specialized, personalized care for your oral health.'}
              </p>
              <div className="mt-auto pt-8 border-t border-bg-alt flex items-center justify-between">
                <span className="text-nav text-accent font-bold">
                  {language === 'fr' ? 'En savoir plus' : 'Learn More'}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveService(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-modal-title"
              aria-describedby="service-modal-description"
              className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
              initial={{ opacity: 0, scale: 0.92, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-accent via-[#c9d9af] to-[#f6c56a]" />

              <div className="relative p-6 md:p-10">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                      {activeServiceData.icon}
                    </div>
                    <div>
                      <p className="text-nav text-accent font-bold mb-2">
                        {activeServiceData.eyebrow}
                      </p>
                      <h3 id="service-modal-title" className="text-3xl md:text-4xl font-bold text-text">
                        {activeServiceData.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveService(null)}
                    className="w-11 h-11 rounded-full border border-bg-alt text-text-light flex items-center justify-center hover:bg-bg-alt transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label={language === 'fr' ? 'Fermer la fenêtre' : 'Close dialog'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-6">
                    <p id="service-modal-description" className="text-lg text-text-light leading-relaxed">
                      {activeServiceData.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="#appointment"
                        onClick={() => setActiveService(null)}
                        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-nav uppercase tracking-widest text-bg-dark transition-transform hover:scale-[1.02]"
                      >
                        {language === 'fr' ? 'Prendre rendez-vous' : 'Book appointment'}
                      </a>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-bg-alt p-6">
                    <p className="text-nav text-text/60 font-bold mb-4">
                      {language === 'fr' ? 'Ce que vous obtenez' : 'What to expect'}
                    </p>
                    <ul className="space-y-4">
                      {activeServiceData.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3 text-text-light leading-relaxed">
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
