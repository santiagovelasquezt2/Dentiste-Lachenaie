import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const GallerySection: React.FC = () => {
  const { t } = useLanguage();

  const images = [
    { src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop', alt: 'Extérieur', span: 'md:col-span-2' },
    { src: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=2069&auto=format&fit=crop', alt: 'Réception' },
    { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop', alt: 'Salle d\'attente' },
    { src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070&auto=format&fit=crop', alt: 'Salle de traitement', span: 'md:col-span-2' },
    { src: 'https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?q=80&w=2070&auto=format&fit=crop', alt: 'Ambiance' },
    { src: 'https://images.unsplash.com/photo-1504280658469-166299298811?q=80&w=2070&auto=format&fit=crop', alt: 'Ambiance' },
  ];

  return (
    <section id="gallery" className="bg-bg-alt py-32 overflow-hidden reveal-on-scroll">
      <div className="container mx-auto px-6">
        <h2 className="text-section-title font-bold text-text mb-20 text-center">
          {t.gallery.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {images.map((img, i) => (
            <div 
              key={i}
              className={`rounded-3xl overflow-hidden shadow-lg group ${img.span || ''}`}
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
