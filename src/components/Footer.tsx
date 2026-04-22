import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] py-8 border-t border-white/10">
      <div className="container mx-auto flex flex-col items-start justify-between gap-4 px-4 sm:px-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-heading font-semibold text-accent">
            VS
          </div>
          <p className="text-body text-left text-bg-inverse/58">
            {t.footer.copy.replace('{year}', year.toString())}
          </p>
        </div>

        <a
          href="https://calytek.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-nav text-left text-bg-inverse/46 transition-colors hover:text-accent/80"
        >
          {t.footer.credit}
        </a>
      </div>
    </footer>
  );
};
