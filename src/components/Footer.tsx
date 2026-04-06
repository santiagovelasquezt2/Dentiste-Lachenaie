import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark py-8 border-t border-accent/10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-heading font-semibold text-accent">
            VS
          </div>
          <p className="text-center text-sm text-bg-inverse/40 md:text-left">
            {t.footer.copy.replace('{year}', year.toString())}
          </p>
        </div>

        <a 
          href="https://calytek.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-bg-inverse/30 transition-colors hover:text-accent/80"
        >
          {t.footer.credit}
        </a>
      </div>
    </footer>
  );
};
