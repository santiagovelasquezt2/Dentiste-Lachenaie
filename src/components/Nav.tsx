import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { isHoursHash, scrollToHoursSection } from '../lib/scrollToHours';
import { cn } from '../lib/utils';
import { clinicData } from '../content/clinic';
import { Menu, X, ExternalLink, Phone, Mail, Plus, ChevronDown } from 'lucide-react';

const logoSrc = `${import.meta.env.BASE_URL}assets/clinic-logo-primary.png`;

const langPillTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 32,
  mass: 0.7,
};

type NavPanel = 'menu' | 'contact' | null;

const dropdownPanelClass =
  'absolute left-0 top-full z-50 mt-2 min-w-[14rem] rounded-2xl border border-black/5 bg-white/95 py-2 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl';

export const Nav: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<NavPanel>(null);

  const patientFormStep = t.firstVisit.steps[0];
  const patientFormHref =
    patientFormStep.download != null
      ? patientFormStep.download.href.startsWith('http')
        ? patientFormStep.download.href
        : `${import.meta.env.BASE_URL}${patientFormStep.download.href.replace(/^\//, '')}`
      : '#first-visit-steps';

  const telHref = `tel:${clinicData.phone.replace(/\D/g, '')}`;
  const emailHref = `mailto:${clinicData.email}`;

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
        setOpenPanel(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (openPanel === null) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!desktopDropdownRef.current?.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [openPanel]);

  useEffect(() => {
    if (openPanel === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPanel(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openPanel]);

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

  const menuLinks = navLinks.filter((l) => l.href !== '#services');

  const togglePanel = (panel: Exclude<NavPanel, null>) => {
    setOpenPanel((p) => (p === panel ? null : panel));
  };

  const navEmphasisClass = 'text-gray-800';

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-500',
        isScrolled
          ? 'border-b border-white/25 bg-white/28 backdrop-blur-xl backdrop-saturate-150 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),0_8px_32px_-12px_rgba(15,23,42,0.1)]'
          : 'border-b border-white/[0.08] bg-gradient-to-r from-white/68 via-white/36 via-[42%] to-black/14 py-5 backdrop-blur-[8px] sm:py-6'
      )}
    >
      <div
        ref={desktopDropdownRef}
        className="flex w-full items-center justify-between gap-3 px-4 sm:px-6 lg:gap-6"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            href="#hero"
            className="flex shrink-0 items-center"
            onClick={() => {
              setIsMenuOpen(false);
              setOpenPanel(null);
            }}
          >
            <img
              src={logoSrc}
              alt="Logo"
              className="h-10 w-auto sm:h-11 transition-opacity duration-500"
            />
          </motion.a>

          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            <div className="relative">
              <button
                type="button"
                aria-expanded={openPanel === 'menu'}
                className={cn(
                  'group inline-flex items-center gap-2 text-base font-semibold tracking-wide transition-colors hover:text-[#7e9c2f]',
                  navEmphasisClass
                )}
                onClick={() => togglePanel('menu')}
              >
                {t.nav.menu}
                <Menu
                  className="size-4 origin-center opacity-80 transition-transform duration-200 ease-out motion-safe:group-hover:scale-110"
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
              <AnimatePresence>
                {openPanel === 'menu' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className={dropdownPanelClass}
                    role="menu"
                  >
                    {menuLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        role="menuitem"
                        onClick={(e) => {
                          handleNavLinkClick(link.href)(e);
                          setOpenPanel(null);
                        }}
                        className="block px-4 py-2.5 text-base font-bold text-gray-900 transition-colors hover:bg-[#f7faf2] hover:text-[#7e9c2f]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#services"
              onClick={() => setOpenPanel(null)}
              className={cn(
                'text-base font-semibold tracking-wide transition-colors hover:text-[#7e9c2f]',
                navEmphasisClass
              )}
            >
              {t.nav.services}
            </a>
          </div>
        </div>

        <div className="hidden shrink-0 items-center justify-end gap-5 lg:flex xl:gap-7">
          <a
            href={patientFormHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpenPanel(null)}
            className={cn(
              'group inline-flex items-center gap-2 text-base font-semibold tracking-wide transition-colors hover:text-[#b0d64e]',
              navEmphasisClass
            )}
          >
            {t.nav.patientForm}
            <ExternalLink
              className="size-3.5 origin-center opacity-90 transition-transform duration-200 ease-out motion-safe:group-hover:-translate-y-px motion-safe:group-hover:translate-x-px"
              aria-hidden
            />
          </a>

          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openPanel === 'contact'}
              aria-label={t.nav.contact}
              className={cn(
                'group inline-flex items-center gap-3 rounded-full border border-transparent bg-white/0 px-3 py-2 text-left transition-colors hover:border-black/5 hover:bg-white/60 hover:text-[#7e9c2f]',
                navEmphasisClass
              )}
              onClick={() => togglePanel('contact')}
            >
              <span className="text-base font-semibold tracking-wide">{t.nav.contact}</span>
              <span className="flex flex-col items-center justify-center leading-none text-gray-800 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-[#7e9c2f]">
                <Phone className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:rotate-[-8deg]" strokeWidth={2} aria-hidden />
                <Mail className="size-4 transition-transform duration-200 ease-out group-hover:translate-y-0.5 group-hover:rotate-[8deg]" strokeWidth={2} aria-hidden />
              </span>
              <ChevronDown
                className="size-4 shrink-0 opacity-70 transition-transform duration-200 ease-out motion-safe:group-hover:translate-y-[1px]"
                strokeWidth={2}
                aria-hidden
              />
            </button>

            <AnimatePresence>
              {openPanel === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-[18rem] overflow-hidden rounded-3xl border border-black/5 bg-white/95 p-2 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl"
                  role="menu"
                  aria-label={t.nav.contact}
                >
                  <a
                    href={telHref}
                    role="menuitem"
                    onClick={() => setOpenPanel(null)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-[#f7faf2] hover:text-[#7e9c2f]"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#f2f7e3] text-[#7e9c2f]">
                      <Phone className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.68rem] uppercase tracking-[0.22em] text-gray-500">
                        {t.contact.phoneLabel}
                      </span>
                      <span className="block truncate text-base font-semibold text-gray-900">
                        {clinicData.phone}
                      </span>
                    </span>
                  </a>
                  <a
                    href={emailHref}
                    role="menuitem"
                    onClick={() => setOpenPanel(null)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-[#f7faf2] hover:text-[#7e9c2f]"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#f2f7e3] text-[#7e9c2f]">
                      <Mail className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.68rem] uppercase tracking-[0.22em] text-gray-500">
                        {t.contact.emailLabel}
                      </span>
                      <span className="block truncate text-base font-semibold text-gray-900">
                        {clinicData.email}
                      </span>
                    </span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#appointment"
            onClick={() => setOpenPanel(null)}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-base font-bold tracking-wide text-bg-dark shadow-sm transition-[transform,background-color,color,box-shadow] hover:scale-[1.02] hover:bg-white hover:shadow-md active:scale-[0.98]"
          >
            {t.nav.bookAppointment}
            <Plus
              className="size-4 origin-center opacity-80 transition-transform duration-200 ease-out motion-safe:group-hover:rotate-90"
              strokeWidth={2.5}
              aria-hidden
            />
          </a>

          <div
            className={cn(
              'relative inline-flex h-8 shrink-0 items-stretch rounded-full border p-0.5 shadow-sm backdrop-blur-sm sm:h-9',
              isScrolled
                ? 'border-white/35 bg-white/55 shadow-sm backdrop-blur-md'
                : 'border-white/40 bg-white/80'
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
                'relative z-10 min-w-[2.25rem] flex-1 rounded-full px-2.5 py-1.5 text-sm font-bold transition-colors duration-300 ease-out sm:min-w-[2.5rem] sm:px-3 sm:text-base',
                language === 'fr' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
              )}
              onClick={() => setLanguage('fr')}
            >
              FR
            </button>
            <button
              type="button"
              aria-pressed={language === 'en'}
              className={cn(
                'relative z-10 min-w-[2.25rem] flex-1 rounded-full px-2.5 py-1.5 text-sm font-bold transition-colors duration-300 ease-out sm:min-w-[2.5rem] sm:px-3 sm:text-base',
                language === 'en' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
              )}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:hidden">
          <a
            href="#appointment"
            className="inline-flex max-w-[9.5rem] truncate rounded-full bg-accent px-3 py-2 text-sm font-bold text-bg-dark shadow-sm transition-colors hover:bg-accent-dark sm:max-w-none sm:px-4 sm:text-base"
            onClick={() => setIsMenuOpen(false)}
          >
            {t.nav.bookAppointment}
          </a>
          <div
            className={cn(
              'relative inline-flex h-8 shrink-0 items-stretch rounded-full border p-0.5 shadow-sm backdrop-blur-sm',
              isScrolled
                ? 'border-white/35 bg-white/55 backdrop-blur-md'
                : 'border-white/40 bg-white/80'
            )}
            role="group"
            aria-label="Language"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-0.5 bottom-0.5 z-0 w-[calc(50%-0.125rem)] rounded-full bg-[#b0d64e] shadow-sm"
              initial={false}
              animate={{ left: language === 'fr' ? '0.125rem' : '50%' }}
              transition={langPillTransition}
            />
            <button
              type="button"
              aria-pressed={language === 'fr'}
              className={cn(
                'relative z-10 min-w-[2rem] flex-1 rounded-full px-2 py-1 text-[0.65rem] font-bold sm:min-w-[2.25rem] sm:px-2.5 sm:text-xs',
                language === 'fr' ? 'text-white' : 'text-gray-600'
              )}
              onClick={() => setLanguage('fr')}
            >
              FR
            </button>
            <button
              type="button"
              aria-pressed={language === 'en'}
              className={cn(
                'relative z-10 min-w-[2rem] flex-1 rounded-full px-2 py-1 text-[0.65rem] font-bold sm:min-w-[2.25rem] sm:px-2.5 sm:text-xs',
                language === 'en' ? 'text-white' : 'text-gray-600'
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
            className="group rounded-full border border-transparent p-2.5 text-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X
                size={24}
                className="origin-center transition-transform duration-200 ease-out motion-safe:group-hover:rotate-90"
                aria-hidden
              />
            ) : (
              <Menu
                size={24}
                className="origin-center transition-transform duration-200 ease-out motion-safe:group-hover:scale-110"
                aria-hidden
              />
            )}
          </button>
        </div>
      </div>

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
              <a
                ref={firstMobileLinkRef}
                href={patientFormHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-base font-bold text-gray-900 transition-colors hover:border-[#b0d64e]/20 hover:bg-[#f7faf2] hover:text-[#7e9c2f]"
              >
                {t.nav.patientForm}
                <ExternalLink
                  className="size-4 origin-center opacity-60 transition-transform duration-200 ease-out motion-safe:group-hover:-translate-y-px motion-safe:group-hover:translate-x-px"
                  aria-hidden
                />
              </a>
              <a
                href={telHref}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-2xl border border-transparent px-4 py-3 text-base font-bold text-gray-900 transition-colors hover:border-[#b0d64e]/20 hover:bg-[#f7faf2]"
              >
                <span className="block">{clinicData.phone}</span>
                <span className="text-base font-semibold text-gray-500">{t.hero.location}</span>
              </a>
              <a
                href="#appointment"
                onClick={() => setIsMenuOpen(false)}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-base font-bold text-bg-dark transition-colors hover:bg-accent-dark"
              >
                {t.nav.bookAppointment}
                <Plus
                  className="size-4 origin-center transition-transform duration-200 ease-out motion-safe:group-hover:rotate-90"
                  aria-hidden
                />
              </a>
              <div className="my-1 border-t border-black/5" />
              <a
                href="#services"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-2xl border border-transparent px-4 py-3 text-base font-bold text-gray-900 transition-colors hover:border-[#b0d64e]/20 hover:bg-[#f7faf2] hover:text-[#7e9c2f]"
              >
                {t.nav.services}
              </a>
              {navLinks
                .filter((l) => l.href !== '#services')
                .map((link) => (
                  <a
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
