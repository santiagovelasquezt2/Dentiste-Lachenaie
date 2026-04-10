import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { isHoursHash, scrollToHoursSection } from '../lib/scrollToHours';
import { cn } from '../lib/utils';
import { Menu, X } from 'lucide-react';

const logoSrc = `${import.meta.env.BASE_URL}assets/clinic-logo-primary.png`;

const langPillTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 32,
  mass: 0.7,
};

export const Nav: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFocusTrap({
    active: isMenuOpen,
    containerRef: menuPanelRef,
    initialFocusRef: firstMobileLinkRef,
    onEscape: () => setIsMenuOpen(false),
  });

  const handleNavLinkClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHoursHash(href)) return;
    e.preventDefault();
    scrollToHoursSection('smooth');
    history.replaceState(null, '', href);
  };

  const navLinks = [
    { href: '#about', label: t.nav.about },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#services', label: t.nav.services },
    { href: '#team', label: t.nav.team },
    { href: '#hours-card', label: t.nav.hours },
    { href: '#first-visit-steps', label: t.nav.firstVisit },
    { href: '#contact', label: t.nav.contact },
  ];

  const navLinksOverImage = navLinks.slice(0, 3);
  const navLinksOverLight = navLinks.slice(3);

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-500',
        isScrolled
          ? 'border-b border-white/30 bg-white/45 backdrop-blur-xl backdrop-saturate-150 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55),0_8px_32px_-12px_rgba(15,23,42,0.12)]'
          : 'bg-transparent py-5 sm:py-8'
      )}
    >
      <div className="flex w-full items-center justify-between gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:justify-items-stretch lg:gap-x-6 xl:gap-x-10">
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            href="#hero"
            className="flex shrink-0 items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src={logoSrc}
              alt="Logo"
              className={cn(
                'h-10 w-auto sm:h-12 transition-[filter] duration-500',
                !isScrolled && 'brightness-0 invert'
              )}
            />
          </motion.a>

          <nav className="hidden min-w-0 items-center gap-8 lg:flex xl:gap-10" aria-label="Primary">
            {navLinksOverImage.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavLinkClick(link.href)}
                className={cn(
                  'shrink-0 border-b border-transparent pb-1 text-sm font-bold tracking-wide transition-colors hover:text-[#b0d64e]',
                  isScrolled ? 'text-gray-800' : 'text-white'
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
          <nav className="hidden items-center justify-end gap-8 lg:flex xl:gap-10" aria-label="Secondary">
            {navLinksOverLight.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavLinkClick(link.href)}
                className="shrink-0 border-b border-transparent pb-1 text-sm font-bold tracking-wide text-gray-800 transition-colors hover:text-[#b0d64e]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div
            className={cn(
              'relative inline-flex h-8 shrink-0 items-stretch rounded-full border p-0.5 shadow-sm backdrop-blur-sm sm:h-9',
              isScrolled
                ? 'border-white/35 bg-white/55 shadow-sm backdrop-blur-md'
                : 'border-gray-200/70 bg-white/75'
            )}
            role="group"
            aria-label="Language"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-0.5 bottom-0.5 z-0 w-[calc(50%-0.125rem)] rounded-full bg-[#b0d64e] shadow-sm"
              initial={false}
              animate={{
                left: language === 'fr' ? '0.125rem' : '50%',
              }}
              transition={langPillTransition}
            />
            <button
              type="button"
              aria-pressed={language === 'fr'}
              className={cn(
                'relative z-10 min-w-[2.25rem] flex-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition-colors duration-300 ease-out sm:min-w-[2.5rem] sm:px-3 sm:text-sm',
                language === 'fr'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              onClick={() => setLanguage('fr')}
            >
              FR
            </button>
            <button
              type="button"
              aria-pressed={language === 'en'}
              className={cn(
                'relative z-10 min-w-[2.25rem] flex-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition-colors duration-300 ease-out sm:min-w-[2.5rem] sm:px-3 sm:text-sm',
                language === 'en'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>

          <button 
            ref={menuButtonRef}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={cn(
              'lg:hidden rounded-full border border-transparent p-2.5 transition-colors',
              isScrolled ? 'text-gray-800' : 'text-white drop-shadow-sm'
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            id="mobile-nav-panel"
            ref={menuPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.practiceName}
            tabIndex={-1}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute inset-x-0 top-full border-t border-black/5 bg-white/95 px-4 pb-6 pt-4 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-h-[calc(100svh-6rem)] w-full max-w-2xl flex-col gap-2 overflow-y-auto rounded-[1.5rem] bg-white px-1 py-1">
              {navLinks.map((link, index) => (
                <a
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleNavLinkClick(link.href)(e);
                    setIsMenuOpen(false);
                  }}
                  className="rounded-2xl border border-transparent px-4 py-3 text-base font-bold text-gray-900 transition-colors hover:border-[#b0d64e]/20 hover:bg-[#f7faf2] hover:text-[#7e9c2f]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
