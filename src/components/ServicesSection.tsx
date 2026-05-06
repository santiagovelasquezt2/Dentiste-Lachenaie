import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../lib/utils';
import { SECTION_HEADING_CLASS } from '../lib/sectionHeading';
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
const SERVICE_ORDER = clinicData.services.map((service) => service.id as ServiceId);

const serviceModalImageSrc: Partial<Record<ServiceId, { src: string; alt: string }>> = {
  orthodontics: {
    src: '/assets/services/orthodontics-smile.jpg',
    alt: 'Smiling patient with braces',
  },
  prevention: {
    src: '/assets/services/prevention-hygiene.jpg',
    alt: 'Dental hygiene and preventive care',
  },
  pediatric: {
    src: '/assets/services/pediatric-children.jpg',
    alt: 'Children brushing their teeth',
  },
  restoration: {
    src: '/assets/services/restoration-tools.jpg',
    alt: 'Dental instruments for restorative treatment',
  },
  implants: {
    src: '/assets/services/implants-bridges.jpg',
    alt: 'Dental implant and bridge restoration',
  },
  emergency: {
    src: '/assets/services/emergency-tools.jpg',
    alt: 'Dental emergency tools and broken teeth model',
  },
  surgery: {
    src: '/assets/services/surgery-tools.jpg',
    alt: 'Dental surgery instruments',
  },
  cosmetic: {
    src: '/assets/services/cosmetic-aesthetic-tools.jpg',
    alt: 'Cosmetic dental instruments and aligner model',
  },
};

function ServiceIcon({ id, className }: { id: ServiceId; className?: string }) {
  return (
    <img
      src={serviceIconSrc[id]}
      alt=""
      className={cn('object-contain', className)}
    />
  );
}
/**
 * Vertical placements for each quote (centered in viewport for visibility).
 * Quote 0 (Mathis) and Quote 3 (Marie-José) are aligned horizontally at 48%.
 */
const QUOTE_POSITIONS = ['13%', '80%', '13%', '80%'];

/** Progress window [start, end] within 0–1 when each quote crosses the screen */
const QUOTE_WINDOWS: [number, number][] = [
  [0.04, 0.38],
  [0.22, 0.56],
  [0.44, 0.78],
  [0.60, 0.94],
];

const QUOTE_CARD_W = 340;

export const ServicesSection: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const quoteRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [activeService, setActiveService] = useState<ServiceId | null>(null);
  const isDialogOpen = activeService !== null;

  const closeActiveService = useCallback(() => {
    setActiveService(null);
  }, []);

  const moveActiveService = useCallback((direction: 1 | -1) => {
    setActiveService((currentService) => {
      if (!currentService) return currentService;

      const currentIndex = SERVICE_ORDER.indexOf(currentService);
      if (currentIndex === -1) return currentService;

      const nextIndex =
        (currentIndex + direction + SERVICE_ORDER.length) % SERVICE_ORDER.length;

      return SERVICE_ORDER[nextIndex];
    });
  }, []);

  const openService = useCallback(
    (serviceId: ServiceId, trigger: HTMLButtonElement | null) => {
      trigger?.blur();
      setActiveService(serviceId);
    },
    []
  );

  const activeServiceData = useMemo(() => {
    if (!activeService) return null;
    const image = serviceModalImageSrc[activeService] ?? null;

    return {
      title: t.services.items[activeService],
      icon: <ServiceIcon id={activeService} className="h-7 w-7 md:h-8 md:w-8" />,
      image,
      ...t.services.details[activeService],
    };
  }, [activeService, t.services.items, t.services.details]);

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

      // Drive quote cards: each flies in from right and exits left
      QUOTE_WINDOWS.forEach(([start, end], i) => {
        const el = quoteRefs.current[i];
        if (!el) return;
        const local = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        const tx = (1 - local) * window.innerWidth - local * QUOTE_CARD_W;
        el.style.transform = `translateX(${tx}px)`;
      });
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
    if (!isDialogOpen) return;

    const scrollY = window.scrollY;
    const { style: bodyStyle } = document.body;
    const { style: htmlStyle } = document.documentElement;
    const previousStyles = {
      bodyOverflow: bodyStyle.overflow,
      bodyPosition: bodyStyle.position,
      bodyTop: bodyStyle.top,
      bodyLeft: bodyStyle.left,
      bodyRight: bodyStyle.right,
      bodyWidth: bodyStyle.width,
      bodyPaddingRight: bodyStyle.paddingRight,
      htmlOverflow: htmlStyle.overflow,
    };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    htmlStyle.overflow = 'hidden';
    bodyStyle.overflow = 'hidden';
    bodyStyle.position = 'fixed';
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.left = '0';
    bodyStyle.right = '0';
    bodyStyle.width = '100%';

    if (scrollbarWidth > 0) {
      bodyStyle.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      bodyStyle.overflow = previousStyles.bodyOverflow;
      bodyStyle.position = previousStyles.bodyPosition;
      bodyStyle.top = previousStyles.bodyTop;
      bodyStyle.left = previousStyles.bodyLeft;
      bodyStyle.right = previousStyles.bodyRight;
      bodyStyle.width = previousStyles.bodyWidth;
      bodyStyle.paddingRight = previousStyles.bodyPaddingRight;
      htmlStyle.overflow = previousStyles.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isDialogOpen]);

  useFocusTrap({
    active: isDialogOpen,
    containerRef: dialogRef,
    initialFocusRef: closeButtonRef,
    onEscape: closeActiveService,
  });

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isDialogOpen) return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveService(-1);
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      moveActiveService(1);
    }
  };

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
          : 'sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden',
        isDialogOpen && 'pointer-events-none select-none'
      )}>
        <div className={cn(
          'mx-auto mb-12 w-full max-w-none',
          isMobile ? 'mb-10 px-0' : 'px-6 md:px-[10vw]'
        )}>
          <h2 className={cn('w-full text-bg-inverse', SECTION_HEADING_CLASS)}>
            {t.services.title}
          </h2>
        </div>

        <div 
          ref={horizontalRef}
          className={cn(
            'transition-transform duration-100 ease-out',
            isMobile
              ? 'grid gap-[calc(1rem*0.765)]'
              : 'flex gap-[calc(2rem*0.765)] px-6 md:px-[10vw]'
          )}
        >
          {clinicData.services.map((service) => (
            <button 
              key={service.id}
              type="button"
              onClick={(event) =>
                openService(service.id as ServiceId, event.currentTarget)
              }
              className={cn(
                'group flex flex-col gap-[calc(1.5rem*0.765)] rounded-[calc(1rem*0.765)] bg-white p-[calc(1.5rem*0.765)] text-left shadow-xl transition-[transform,box-shadow,opacity] duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[calc(0.25rem*0.765)] md:p-[calc(3rem*0.765)]',
                isMobile
                  ? 'w-full'
                  : 'w-[calc(300px*0.765)] flex-shrink-0 md:w-[calc(400px*0.765)]',
                !isDialogOpen && !isMobile && 'hover:scale-[1.02]',
                isDialogOpen &&
                  (service.id === activeService
                    ? 'opacity-35 shadow-none'
                    : 'opacity-55 shadow-lg')
              )}
            >
              <div className="w-[calc(4rem*0.765)] h-[calc(4rem*0.765)] bg-accent/20 rounded-[calc(1rem*0.765)] flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg-dark transition-colors duration-300">
                <ServiceIcon id={service.id as ServiceId} className="h-[calc(2rem*0.765)] w-[calc(2rem*0.765)]" />
              </div>
              <h3 className="text-[clamp(calc(1.35rem*0.765),calc(2.1vw*0.765),calc(1.8rem*0.765))] md:text-[calc(1.875rem*0.765)] font-heading font-semibold leading-[1.08] tracking-[-0.04em] text-text group-hover:text-accent transition-colors">
                {t.services.items[service.id as keyof typeof t.services.items]}
              </h3>
              <p className="text-[calc(1rem*0.765)] leading-relaxed text-text-light">
                {t.services.cardTeaser}
              </p>
              <div className="mt-auto pt-[calc(2rem*0.765)] border-t border-bg-alt flex items-center justify-between">
                <span className="font-nav text-[calc(0.72rem*0.765)] uppercase leading-none tracking-[0.18em] text-accent/90">
                  {t.services.learnMore}
                </span>
                <div className="w-[calc(2.5rem*0.765)] h-[calc(2.5rem*0.765)] border border-accent rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-bg-dark transition-all">
                  <ChevronRight className="w-[calc(1.25rem*0.765)] h-[calc(1.25rem*0.765)]" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Scroll-driven floating quotes — desktop only, over bare background */}
        {!isMobile && (t.services.quotes as { text: string; author: string }[]).map((q, i) => (
          <div
            key={i}
            ref={(el) => { quoteRefs.current[i] = el; }}
            aria-hidden="true"
            className="pointer-events-none absolute z-10 will-change-transform"
            style={{
              top: QUOTE_POSITIONS[i],
              width: QUOTE_CARD_W,
              transform: `translateX(${window.innerWidth}px)`,
            }}
          >
            <p className="font-heading text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-white">
              &ldquo;{q.text}&rdquo;
            </p>
            <p className="mt-2 font-nav text-[0.68rem] uppercase tracking-[0.18em] text-white/50">
              — {q.author}
            </p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeServiceData && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-[rgba(12,16,13,0.78)] px-4 py-4 sm:items-center sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={closeActiveService}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-modal-title"
              aria-describedby="service-modal-description"
              tabIndex={-1}
              className="relative flex max-h-[calc(100svh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:rounded-[2rem]"
              initial={{ opacity: 0, scale: 0.965, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: 12 }}
              transition={{ type: 'spring', stiffness: 280, damping: 30, mass: 0.9 }}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={handleDialogKeyDown}
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-accent via-[#c9d9af] to-[#f6c56a]" />

              <div className="relative flex min-h-0 flex-col">
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeActiveService}
                  className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-bg-alt text-text-light transition-colors hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={t.services.closeDialog}
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="grid min-h-0 md:grid-cols-[1.08fr_0.92fr]">
                  <div className="relative min-h-[24rem] overflow-hidden bg-[#eef4e5] md:min-h-0 md:border-r md:border-black/5">
                    {activeServiceData.image ? (
                      <img
                        src={activeServiceData.image.src}
                        alt={activeServiceData.image.alt}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-10">
                        {activeServiceData.icon}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-black/8 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <a
                        href="#appointment"
                        onClick={closeActiveService}
                        className="inline-flex w-full items-center justify-center rounded-full bg-brand-lime px-6 py-3 text-sm font-nav uppercase tracking-[0.15em] text-bg-dark shadow-[0_12px_32px_rgba(0,0,0,0.2)] transition-transform hover:scale-[1.01] hover:bg-brand-press"
                      >
                        {t.services.bookAppointment}
                      </a>
                    </div>
                  </div>

                  <div className="min-h-0 overflow-y-auto overscroll-contain bg-white px-5 pb-6 pt-16 sm:px-6 sm:pb-8 sm:pt-16 md:px-8 md:pb-8 md:pt-20">
                    <div className="max-w-xl">
                      <p className="mb-3 text-nav text-accent/90">
                        {activeServiceData.eyebrow}
                      </p>
                      <h3 id="service-modal-title" className="text-3xl font-heading font-semibold leading-tight tracking-tight text-text md:text-4xl">
                        {activeServiceData.title}
                      </h3>

                      <p id="service-modal-description" className="mt-5 text-base leading-relaxed text-text-light md:text-lg">
                        {activeServiceData.description}
                      </p>

                      <div className="mt-8 rounded-[1.5rem] bg-bg-alt p-6">
                        <p className="mb-4 text-nav text-text/60">
                          {t.services.whatToExpect}
                        </p>
                        <ul className="space-y-4">
                          {activeServiceData.highlights.map((highlight) => (
                            <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-text-light md:text-base">
                              <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
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
