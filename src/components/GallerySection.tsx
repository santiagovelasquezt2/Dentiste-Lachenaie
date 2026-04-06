import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
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

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImageIndex(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeImageIndex]);

  return (
    <section id="gallery" className="bg-bg-alt py-32 overflow-hidden reveal-on-scroll">
      <div className="container mx-auto px-6">
        <h2 className="mb-20 text-center text-section-title font-heading font-semibold text-text">
          {t.gallery.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActiveImageIndex(i)}
              className={`group relative block h-full w-full rounded-3xl overflow-hidden shadow-lg text-left cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-alt ${img.span || ''}`}
              aria-label={`${t.gallery.openFullScreen} ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-nav text-text">
                  {t.gallery.openFullScreen}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeImageIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Full-screen image view: ${images[activeImageIndex].alt}`}
          onClick={() => setActiveImageIndex(null)}
        >
          <div className="relative flex max-h-[92svh] max-w-[96vw] flex-col items-center gap-4">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveImageIndex(null);
              }}
              className="absolute -top-2 right-0 z-10 rounded-full bg-white/90 px-4 py-2 text-xs font-nav text-text shadow-lg transition-colors hover:bg-white"
              aria-label={t.gallery.closeFullScreen}
            >
              {t.gallery.closeFullScreen}
            </button>
            <img
              src={images[activeImageIndex].src}
              alt={images[activeImageIndex].alt}
              className="max-h-[82svh] w-auto max-w-[96vw] rounded-2xl object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
              decoding="async"
            />
            <p className="max-w-2xl text-center text-sm md:text-base text-white/80">
              {images[activeImageIndex].alt}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
