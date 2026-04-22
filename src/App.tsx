/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { isHoursHash, scrollToHoursSection } from './lib/scrollToHours';
import { LanguageProvider } from './context/LanguageContext';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { TeamBubbles } from './components/TeamBubbles';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { Tooth3DSection } from './components/Tooth3DSection';
import { TeamSection } from './components/TeamSection';
import { GallerySection } from './components/GallerySection';
import { HoursSection } from './components/HoursSection';
import { FirstVisitSection } from './components/FirstVisitSection';
import { AppointmentForm } from './components/AppointmentForm';
import { ContactSection } from './components/ContactSection';
import { ReviewSection } from './components/ReviewSection';
import { Footer } from './components/Footer';

export default function App() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!isHoursHash(hash)) return;

    const run = () => scrollToHoursSection('instant');
    requestAnimationFrame(() => requestAnimationFrame(run));
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-bg selection:bg-accent selection:text-bg-dark">
        <Nav />
        <main>
          <Hero />
          <TeamBubbles />
          <AboutSection />
          <ServicesSection />
          <Tooth3DSection />
          <TeamSection />
          <GallerySection />
          <HoursSection />
          <FirstVisitSection />
          <AppointmentForm />
          <ContactSection />
          <ReviewSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

