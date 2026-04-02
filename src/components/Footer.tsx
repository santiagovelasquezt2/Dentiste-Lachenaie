import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark py-12 border-t border-accent/10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent font-heading font-bold text-sm">
            VS
          </div>
          <p className="text-sm text-bg-inverse/40 font-nav uppercase tracking-widest">
            {t.footer.copy.replace('{year}', year.toString())}
          </p>
        </div>

        <div className="flex items-center gap-8">
          <a 
            href="https://calytek.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-bg-inverse/30 hover:text-accent transition-colors font-nav uppercase tracking-tighter"
          >
            {t.footer.credit}
          </a>
        </div>
      </div>
    </footer>
  );
};
