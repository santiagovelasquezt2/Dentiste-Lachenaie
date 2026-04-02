import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';

export const HoursSection: React.FC = () => {
  const { t } = useLanguage();

  const days = [
    { key: 'monday', label: t.hours.monday },
    { key: 'tuesday', label: t.hours.tuesday },
    { key: 'wednesday', label: t.hours.wednesday },
    { key: 'thursday', label: t.hours.thursday },
    { key: 'friday', label: t.hours.friday },
    { key: 'saturday', label: t.hours.saturday },
    { key: 'sunday', label: t.hours.sunday },
  ];

  return (
    <section id="hours" className="bg-white py-32 reveal-on-scroll">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-bg-alt rounded-[40px] p-12 md:p-20 shadow-xl relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full" />
          
          <h2 className="text-section-title font-bold text-text mb-12 text-center">
            {t.hours.title}
          </h2>

          <div className="flex flex-col gap-6">
            {days.map((day) => (
              <div 
                key={day.key}
                className="flex items-center justify-between border-b border-text/10 pb-4 group"
              >
                <span className="text-xl font-heading font-medium group-hover:text-accent transition-colors">
                  {day.label}
                </span>
                <span className="text-xl font-mono text-text-light group-hover:text-text transition-colors">
                  {clinicData.hours[day.key as keyof typeof clinicData.hours]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
