import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import { Phone, Mail, MapPin } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="bg-bg-dark py-32 text-bg-inverse overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-section-title font-bold mb-12">
              {t.contact.title}
            </h2>
            
            <div className="flex flex-col gap-10">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                  <MapPin className="text-accent group-hover:text-bg-dark" />
                </div>
                <div>
                  <h3 className="text-nav text-accent/60 mb-2">Adresse</h3>
                  <p className="text-xl font-medium leading-relaxed">
                    {clinicData.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                  <Phone className="text-accent group-hover:text-bg-dark" />
                </div>
                <div>
                  <h3 className="text-nav text-accent/60 mb-2">Téléphone</h3>
                  <a 
                    href={`tel:${clinicData.phone.replace(/\D/g, '')}`}
                    className="text-2xl md:text-3xl font-mono hover:text-accent transition-colors"
                  >
                    {clinicData.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                  <Mail className="text-accent group-hover:text-bg-dark" />
                </div>
                <div>
                  <h3 className="text-nav text-accent/60 mb-2">Courriel</h3>
                  <a 
                    href={`mailto:${clinicData.email}`}
                    className="text-xl font-medium hover:text-accent transition-colors"
                  >
                    {clinicData.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-video rounded-[40px] overflow-hidden shadow-2xl border-2 border-accent/20">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-bg-alt/10 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
                alt="Map" 
                className="w-full h-full object-cover opacity-50 grayscale"
              />
              <div className="absolute inset-0 bg-bg-dark/40" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-pulse">
                  <MapPin size={32} className="text-bg-dark" />
                </div>
                <span className="text-nav font-bold">Terrebonne, QC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
