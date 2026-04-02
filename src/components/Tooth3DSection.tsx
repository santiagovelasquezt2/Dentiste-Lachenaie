import React from 'react';
import { ToothCanvas } from './ToothCanvas';
import { useLanguage } from '../context/LanguageContext';

export const Tooth3DSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="tooth-3d" className="relative h-screen bg-bg flex items-center overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-2 items-center h-full">
        <div className="z-10">
          <h2 className="text-section-title font-bold text-text mb-8">
            Technologie de pointe pour votre sourire
          </h2>
          <p className="text-xl text-text-light max-w-md leading-relaxed">
            Nous utilisons les dernières innovations en dentisterie numérique pour assurer des résultats précis, durables et esthétiques.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <div className="w-12 h-[2px] bg-accent" />
            <span className="text-nav text-accent font-bold">Modélisation 3D avancée</span>
          </div>
        </div>
        
        <div className="absolute inset-0 md:relative h-full w-full opacity-40 md:opacity-100">
          <ToothCanvas />
        </div>
      </div>
    </section>
  );
};
