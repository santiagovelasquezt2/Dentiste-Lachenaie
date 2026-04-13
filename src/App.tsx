/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { isHoursHash, scrollToHoursSection } from './lib/scrollToHours';
import { LanguageProvider } from './context/LanguageContext';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
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
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (!isHoursHash(hash)) return;

    const run = () => scrollToHoursSection('instant');
    requestAnimationFrame(() => requestAnimationFrame(run));
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-bg selection:bg-accent selection:text-bg-dark">
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left"
          style={{ scaleX }}
        />
        <Nav />
        <main>
          <Hero />
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

