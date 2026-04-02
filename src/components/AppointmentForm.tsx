import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './Button';
import { cn } from '../lib/utils';

export const AppointmentForm: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Demande de rendez-vous: ${formData.name}`;
    const body = `
      Nom: ${formData.name}
      Email: ${formData.email}
      Téléphone: ${formData.phone}
      Date souhaitée: ${formData.date}
      Raison: ${formData.reason}
    `;
    window.location.href = `mailto:info@dentistelachenaie.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="appointment" className="bg-white py-32">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-section-title font-bold text-text mb-4">
            {t.appointment.title}
          </h2>
          <p className="text-lg text-text-light">
            Remplissez le formulaire ci-dessous et nous vous contacterons sous peu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-nav text-text/60 ml-4">{t.appointment.name}</label>
              <input 
                required
                type="text"
                placeholder="Jean Dupont"
                className="bg-bg-alt border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-accent outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-nav text-text/60 ml-4">{t.appointment.email}</label>
              <input 
                required
                type="email"
                placeholder="jean@exemple.com"
                className="bg-bg-alt border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-accent outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-nav text-text/60 ml-4">{t.appointment.phone}</label>
              <input 
                required
                type="tel"
                placeholder="(450) 000-0000"
                className="bg-bg-alt border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-accent outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-nav text-text/60 ml-4">{t.appointment.date}</label>
              <input 
                required
                type="date"
                className="bg-bg-alt border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-accent outline-none transition-all"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-nav text-text/60 ml-4">{t.appointment.reason}</label>
            <textarea 
              rows={4}
              placeholder="Décrivez brièvement la raison de votre visite..."
              className="bg-bg-alt border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-accent outline-none transition-all resize-none"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </div>

          <div className="flex justify-center mt-4">
            <Button type="submit" size="lg" className="w-full md:w-auto">
              {t.appointment.submit}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
