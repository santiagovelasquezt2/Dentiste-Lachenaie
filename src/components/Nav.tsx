import React, { useState, useEffect } from 'react';
import clinicLogo from '@/DentalContent/Images/Logo/clinic-logo-primary.png';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { Menu, X } from 'lucide-react';

export const Nav: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#services', label: t.nav.services },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#first-visit-steps', label: t.nav.firstVisit },
    { href: '#appointment', label: t.nav.appointment },
    { href: '#contact', label: t.nav.contact },
  ];

  // #region agent log
  const logNavClick = (href: string) => {
    fetch('http://127.0.0.1:7516/ingest/8d447b25-2b2c-4cbb-b15f-8fbee55e32bb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '40b3fd' },
      body: JSON.stringify({ sessionId: '40b3fd', hypothesisId: 'H-B', location: 'Nav.tsx:navClick', message: 'nav link clicked', data: { href, scrollY: window.scrollY }, timestamp: Date.now() })
    }).catch(() => {});
  };
  // #endregion

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-500',
        isScrolled 
          ? 'bg-white/55 backdrop-blur-lg py-3 shadow-sm border-b border-accent/20' 
          : 'bg-gradient-to-b from-white/75 to-white/0 py-6'
      )}
    >
      <div className="container mx-auto px-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center shrink-0"
          onClick={() => setIsMenuOpen(false)}
          aria-label={`${t.nav.practiceName} — ${t.nav.home}`}
        >
          <img
            src={clinicLogo}
            alt=""
            className="h-9 sm:h-10 w-auto max-w-[160px] sm:max-w-[200px] object-contain object-center"
            width={200}
            height={44}
            decoding="async"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-wrap">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-nav text-text/80 hover:text-accent transition-colors"
              onClick={() => logNavClick(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Lang Toggle & Mobile Menu */}
        <div className="flex items-center justify-center gap-4 shrink-0">
          <div className="flex items-center bg-bg-alt rounded-full p-1">
            <button
              onClick={() => setLanguage('fr')}
              className={cn(
                'px-3 py-1 text-xs font-nav rounded-full transition-all',
                language === 'fr' ? 'bg-accent text-bg-dark shadow-sm' : 'text-text/60'
              )}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={cn(
                'px-3 py-1 text-xs font-nav rounded-full transition-all',
                language === 'en' ? 'bg-accent text-bg-dark shadow-sm' : 'text-text/60'
              )}
            >
              EN
            </button>
          </div>

          <button 
            className="lg:hidden text-text"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-accent w-full origin-left scale-x-0 transition-transform duration-100" id="scroll-progress" />

      {/* Mobile Menu Overlay */}
      <div className={cn(
        'fixed inset-0 bg-bg-dark z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 lg:hidden',
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-heading text-bg-inverse hover:text-accent transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
};
