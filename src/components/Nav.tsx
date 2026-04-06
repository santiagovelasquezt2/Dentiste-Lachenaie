import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';

const logoSrc = `${import.meta.env.BASE_URL}assets/clinic-logo-primary.png`;

export const Nav: React.FC = () => {
  const { t } = useLanguage();
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
    { href: '#about', label: 'About us' },
    { href: '#gallery', label: 'Portfolio' },
    { href: '#services', label: 'Services' },
    { href: '#team', label: 'Team' },
    { href: '#hours-card', label: 'Price list' },
    { href: '#first-visit-steps', label: 'FAQ' },
    { href: '#contact', label: 'Contacts' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-500',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' 
          : 'bg-transparent py-8'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo Icon Only */}
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          href="#hero"
          className="flex items-center shrink-0"
          onClick={() => setIsMenuOpen(false)}
        >
          <img
            src={logoSrc}
            alt="Logo"
            className="h-12 w-auto"
          />
        </motion.a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-bold transition-colors tracking-wide border-b border-transparent pb-1 hover:text-[#b0d64e]",
                isScrolled ? "text-gray-800" : "text-gray-800"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Language Toggle & Mobile Menu Toggle */}
        <div className="flex items-center gap-6">
          <div className={cn(
            "hidden lg:flex items-center gap-1 text-sm font-bold cursor-pointer transition-colors hover:text-[#b0d64e]",
            isScrolled ? "text-gray-800" : "text-gray-800"
          )}>
            <span>EN</span>
            <ChevronDown size={14} />
          </div>
          
          <button 
            className={cn("lg:hidden p-2 transition-colors", isScrolled ? "text-gray-800" : "text-gray-800")}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-bold text-gray-900 hover:text-[#b0d64e] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
