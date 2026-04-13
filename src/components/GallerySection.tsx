import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import clinicExterior from '@/DentalContent/Images/Ouside of the building/clinic-exterior-front-signage-01.jpg';
import clinicReception from '@/DentalContent/Images/Inside of the practice/clinic-reception-01.jpg';
import clinicWaitingRoom1 from '@/DentalContent/Images/Inside of the practice/clinic-waiting-room-01.jpg';
import clinicWaitingRoom2 from '@/DentalContent/Images/Inside of the practice/clinic-waiting-room-02.jpg';
import clinicTreatmentRoom from '@/DentalContent/Images/Inside of the practice/clinic-treatment-room-01.jpg';
import clinicSterilizationRoom from '@/DentalContent/Images/Inside of the practice/clinic-sterilization-room-01.jpg';

type GalleryImage = {
  src: string;
  alt: string;
  span?: string;
};

export const GallerySection: React.FC = () => {
  const { t } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  const images: GalleryImage[] = [
    { src: clinicExterior, alt: t.gallery.images.exterior, span: 'md:col-span-2' },
    { src: clinicReception, alt: t.gallery.images.reception },
    { src: clinicWaitingRoom1, alt: t.gallery.images.waitingRoom },
    { src: clinicTreatmentRoom, alt: t.gallery.images.treatmentRoom, span: 'md:col-span-2' },
    { src: clinicSterilizationRoom, alt: t.gallery.images.sterilizationRoom },
    { src: clinicWaitingRoom2, alt: t.gallery.images.waitingArea },
  ];

  useEffect(() => {
    if (activeImageIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeImageIndex]);

  useFocusTrap({
    active: activeImageIndex !== null,
    containerRef: dialogRef,
    initialFocusRef: closeButtonRef,
    onEscape: () => setActiveImageIndex(null),
  });

  useEffect(() => {
    if (activeImageIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveImageIndex((i) =>
          i === null ? null : (i - 1 + images.length) % images.length
        );
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveImageIndex((i) => (i === null ? null : (i + 1) % images.length));
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeImageIndex, images.length]);

  const galleryPositionAria = (current: number, total: number) =>
    t.gallery.imagePositionAria
      .replace('{{current}}', String(current))
      .replace('{{total}}', String(total));

  return (
    <section id="gallery" className="relative scroll-mt-24 overflow-hidden bg-bg-alt py-20 reveal-on-scroll md:py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        aria-hidden
        style={{
          background:
            'linear-gradient(180deg, rgba(247,247,241,0.95) 0%, rgba(244,244,244,0) 100%)',
        }}
      />
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="mb-12 text-center text-section-title font-heading font-semibold text-text md:mb-20">
          {t.gallery.title}
        </h2>

        <div className="grid grid-cols-1 gap-4 auto-rows-[220px] sm:gap-6 sm:auto-rows-[260px] md:grid-cols-3 md:auto-rows-[300px]">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActiveImageIndex(i)}
              className={`group relative block h-full w-full cursor-zoom-in overflow-hidden rounded-3xl text-left shadow-lg shadow-black/10 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-2xl motion-safe:hover:shadow-black/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-alt ${img.span || ''}`}
              aria-label={`${t.gallery.openFullScreen} ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full origin-center object-cover transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-safe:group-hover:scale-[1.07]"
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-safe:translate-y-3 motion-safe:group-hover:translate-y-0 group-hover:opacity-100">
                <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-nav text-text shadow-md shadow-black/10 ring-1 ring-black/5 backdrop-blur-sm transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-safe:group-hover:shadow-lg">
                  {t.gallery.openFullScreen}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeImageIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-3 pt-5 backdrop-blur-md sm:items-center sm:p-6 md:p-8"
          onClick={() => setActiveImageIndex(null)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${galleryPositionAria(activeImageIndex + 1, images.length)}: ${images[activeImageIndex].alt}`}
            tabIndex={-1}
            className="relative flex w-full max-w-[min(96vw,1400px)] flex-col gap-3 sm:gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {galleryPositionAria(activeImageIndex + 1, images.length)}: {images[activeImageIndex].alt}
            </span>

            <div className="flex w-full shrink-0 items-center justify-between gap-3 px-0.5">
              <p
                className="min-w-0 text-sm font-nav tabular-nums text-white/90 sm:text-base"
                aria-hidden="true"
              >
                {activeImageIndex + 1} / {images.length}
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImageIndex(null);
                }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/95 text-text shadow-lg transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 sm:h-12 sm:w-12"
                aria-label={t.gallery.closeFullScreen}
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
              </button>
            </div>

            <div className="relative flex w-full items-center justify-center">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImageIndex((i) =>
                    i === null ? null : (i - 1 + images.length) % images.length
                  );
                }}
                className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:left-1 sm:h-12 sm:w-12 md:-left-2"
                aria-label={t.gallery.previousImage}
              >
                <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
              </button>

              <img
                src={images[activeImageIndex].src}
                alt={images[activeImageIndex].alt}
                className="max-h-[min(78svh,calc(100svh-10rem))] w-auto max-w-[min(88vw,calc(100%-7rem))] rounded-2xl object-contain shadow-2xl sm:max-h-[min(82svh,calc(100svh-8.5rem))] sm:max-w-[min(90vw,calc(100%-8rem))]"
                onClick={(event) => event.stopPropagation()}
                decoding="async"
              />

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImageIndex((i) => (i === null ? null : (i + 1) % images.length));
                }}
                className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:right-1 sm:h-12 sm:w-12 md:-right-2"
                aria-label={t.gallery.nextImage}
              >
                <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
              </button>
            </div>

            <p className="max-w-2xl px-1 text-center text-sm text-white/85 md:text-base">
              {images[activeImageIndex].alt}
            </p>

            <p className="text-center text-xs text-white/55">{t.gallery.lightboxKeyboardHint}</p>
          </div>
        </div>
      )}
    </section>
  );
};
