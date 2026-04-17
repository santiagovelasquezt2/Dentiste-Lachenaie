import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import dentist1 from '@/DentalContent/Images/Team/Dentists/dentist-dr-marie-christine-st-onge-new.png';
import dentist2 from '@/DentalContent/Images/Team/Dentists/dentist-dr-nathalie-vaillancourt.jpg';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useLanguage } from '../context/LanguageContext';

const REVEAL_MUTED_COLOR = '#BEC7C2';
const REVEAL_ACTIVE_COLOR = '#0A1A14';
const READING_START = 0.30;
const READING_END = 0.80;

type AnimatedWordProps = {
  index: number;
  progress: MotionValue<number>;
  word: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const AnimatedWord = ({ index, progress, word }: AnimatedWordProps) => {
  // Two-layer clip-path reveal: muted base always visible, active overlay clipped from the right.
  // Avoids the background-clip transparency bug where glyph ink outside the advance-width box
  // (common on F, Y, T, etc.) would appear transparent instead of muted.
  // At full reveal clip-path is 'none', so every glyph pixel paints without restriction.
  const clipPath = useTransform(progress, (latest) => {
    const w = clamp(latest - index, 0, 1);
    if (w >= 1) return 'none';
    return `inset(0 ${(1 - w) * 100}% 0 0)`;
  });

  return (
    <span
      className="relative inline-block align-baseline"
      style={{ color: REVEAL_MUTED_COLOR }}
    >
      {word}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ clipPath, WebkitClipPath: clipPath, color: REVEAL_ACTIVE_COLOR }}
      >
        {word}
      </motion.span>
    </span>
  );
};

const StaticRevealParagraph = ({ text }: { text: string }) => {
  return <div className="text-section-title font-normal! text-text">{text}</div>;
};

const AnimatedRevealParagraph = ({
  scrollYProgress,
  text,
}: {
  scrollYProgress: MotionValue<number>;
  text: string;
}) => {
  const words = text.split(/\s+/);
  const readingProgress = useTransform(
    scrollYProgress,
    [0, READING_START, READING_END, 1],
    [0, 0, words.length, words.length]
  );

  return (
    <div className="text-section-title font-normal! text-text">
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <AnimatedWord index={index} progress={readingProgress} word={word} />
          {index < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export const TeamBubbles: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = Boolean(useReducedMotion());
  const shouldAnimate = isDesktop && !prefersReducedMotion;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 88%', 'end 18%'],
  });

  return (
    <section
      ref={sectionRef}
      className="relative isolate z-10 bg-white px-6 pb-20 pt-[clamp(16rem,48vh,34rem)] md:px-12 md:pb-32 md:pt-[clamp(20rem,54vh,42rem)] lg:px-24 lg:pt-[clamp(22rem,58vh,48rem)]"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-8 xl:gap-12">
          <div className="flex shrink-0 items-start gap-4 sm:gap-6">
            <span className="text-section-title font-normal! text-text">{t.team.bubblesPrefix}</span>
            <div className="flex items-center">
              <div className="relative z-10 h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full border-[2px] border-white bg-[#e4e2e0] shadow-sm sm:h-[5.5rem] sm:w-[5.5rem] md:h-[6.5rem] md:w-[6.5rem] lg:h-[7.5rem] lg:w-[7.5rem]">
                <img
                  src={dentist1}
                  alt="Dr. Marie-Christine St-Onge"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <div className="relative z-20 -ml-4 h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full border-[2px] border-white bg-[#e4e2e0] shadow-sm sm:-ml-5 sm:h-[5.5rem] sm:w-[5.5rem] md:-ml-6 md:h-[6.5rem] md:w-[6.5rem] lg:-ml-8 lg:h-[7.5rem] lg:w-[7.5rem]">
                <img
                  src={dentist2}
                  alt="Dr. Nathalie Vaillancourt"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <div className="relative z-30 -ml-4 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-[2px] border-white bg-[#e4e2e0] shadow-sm sm:-ml-5 sm:h-[5.5rem] sm:w-[5.5rem] md:-ml-6 md:h-[6.5rem] md:w-[6.5rem] lg:-ml-8 lg:h-[7.5rem] lg:w-[7.5rem]">
                <span className="inline-block origin-center scale-y-[1.08] font-heading text-[clamp(1.2rem,2.65vw,1.95rem)] font-semibold leading-none tracking-[-0.055em] text-text">
                  +10
                </span>
              </div>
            </div>
          </div>

          {shouldAnimate ? (
            <AnimatedRevealParagraph scrollYProgress={scrollYProgress} text={t.team.bubblesReveal} />
          ) : (
            <StaticRevealParagraph text={t.team.bubblesReveal} />
          )}
        </div>
      </div>
    </section>
  );
};
