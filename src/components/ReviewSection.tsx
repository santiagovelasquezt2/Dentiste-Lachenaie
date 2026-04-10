import React from 'react';
import { ArrowUpRight, Facebook, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';

export const ReviewSection: React.FC = () => {
  const { t } = useLanguage();

  const googleReviewUrl = 'https://search.google.com/local/writereview?placeid=ChIJ221FV8bmyEwRLA6fcmZT6hI';
  const facebookPageUrl = `https://www.facebook.com/search/pages/?q=${encodeURIComponent(clinicData.name)}`;

  return (
    <section id="reviews" className="relative overflow-hidden bg-[#1a1a1a] py-10 text-bg-inverse">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(176,214,78,0.08),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(176,214,78,0.04),_transparent_40%)]"
        aria-hidden
      />
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#2a2a2a]/80 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-[#323232]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-bg-dark">
                <Star className="h-4 w-4 fill-current" />
              </div>
              <div className="min-w-0">
                <p className="text-nav text-bg-inverse/45">
                  Google
                </p>
                <p className="truncate text-base font-medium text-bg-inverse">
                  {t.reviews.googleCta}
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href={facebookPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#2a2a2a]/80 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-[#323232]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-bg-inverse">
                <Facebook className="h-4 w-4 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-nav text-bg-inverse/45">
                  Facebook
                </p>
                <p className="truncate text-base font-medium text-bg-inverse">
                  {t.reviews.facebookCta}
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
