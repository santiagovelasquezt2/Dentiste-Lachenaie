import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './Button';

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
    const subject = `${t.appointment.subjectPrefix}: ${formData.name}`;
    const body = `
      ${t.appointment.bodyName}: ${formData.name}
      ${t.appointment.bodyEmail}: ${formData.email}
      ${t.appointment.bodyPhone}: ${formData.phone}
      ${t.appointment.bodyDate}: ${formData.date}
      ${t.appointment.bodyReason}: ${formData.reason}
    `;
    window.location.href = `mailto:info@dentistelachenaie.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="appointment" className="scroll-mt-24 bg-white py-20 md:py-32">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 font-display text-[clamp(2.35rem,5vw,4.1rem)] font-normal leading-[1.12] tracking-[-0.055em] text-text">
            {t.appointment.title}
          </h2>
          <p className="text-body-lg text-text-light">
            {t.appointment.intro}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 md:gap-8">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-nav text-text/60 ml-4">{t.appointment.name}</label>
              <input 
                required
                type="text"
                placeholder={t.appointment.placeholderName}
                className="text-body bg-bg-alt rounded-full border-none px-6 py-4 placeholder:text-text-light/60 focus:ring-2 focus:ring-accent outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-nav text-text/60 ml-4">{t.appointment.email}</label>
              <input 
                required
                type="email"
                placeholder={t.appointment.placeholderEmail}
                className="text-body bg-bg-alt rounded-full border-none px-6 py-4 placeholder:text-text-light/60 focus:ring-2 focus:ring-accent outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-nav text-text/60 ml-4">{t.appointment.phone}</label>
              <input 
                required
                type="tel"
                inputMode="tel"
                placeholder={t.appointment.placeholderPhone}
                className="text-body bg-bg-alt rounded-full border-none px-6 py-4 placeholder:text-text-light/60 focus:ring-2 focus:ring-accent outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-nav text-text/60 ml-4">{t.appointment.date}</label>
              <input 
                required
                type="date"
                className="text-body bg-bg-alt rounded-full border-none px-6 py-4 focus:ring-2 focus:ring-accent outline-none transition-all"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-nav text-text/60 ml-4">{t.appointment.reason}</label>
            <textarea 
              rows={4}
              placeholder={t.appointment.placeholderReason}
              className="text-body bg-bg-alt resize-none rounded-3xl border-none px-6 py-4 placeholder:text-text-light/60 focus:ring-2 focus:ring-accent outline-none transition-all"
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
