import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

type TFunction = ReturnType<typeof useLanguage>['t'];

const SectionBackdrop = () => (
  <>
    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f0f1ea] to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#f4f4f4]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,238,214,0.6),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(244,247,235,0.9),transparent_45%)]" />
  </>
);

const TeamIntro = ({
  t,
  imageMotionStyle,
  textMotionStyle,
  frameMotionStyle,
  ambientMotionStyle,
  handoffMotionStyle,
  desktop = false,
}: {
  t: TFunction;
  imageMotionStyle?: Record<string, unknown>;
  textMotionStyle?: Record<string, unknown>;
  frameMotionStyle?: Record<string, unknown>;
  ambientMotionStyle?: Record<string, unknown>;
  handoffMotionStyle?: Record<string, unknown>;
  desktop?: boolean;
}) => (
  <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
    <motion.div
      style={ambientMotionStyle}
      className="pointer-events-none absolute left-1/2 top-[12%] h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,214,78,0.16),rgba(176,214,78,0.04)_38%,transparent_72%)] blur-3xl"
    />

    <motion.div style={textMotionStyle} className="relative z-10 w-full">
      <h2 className="mx-auto max-w-[11ch] text-section-title font-semibold tracking-tight text-[#1f281d]">
        {t.team.title}
      </h2>
      <p className="mx-auto mt-6 max-w-[42rem] text-balance text-[1.02rem] leading-7 text-[#394539] md:text-[1.15rem] md:leading-8">
        {t.team.subtitle}
      </p>
    </motion.div>

    <motion.div
      style={frameMotionStyle}
      className="relative z-10 mx-auto mt-12 w-full max-w-[21rem] md:mt-14 md:max-w-[24rem]"
    >
      <div className="absolute -inset-4 rounded-[2.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(233,237,221,0.14))] opacity-70 blur-2xl" />
      <motion.div
        style={imageMotionStyle}
        className="group relative overflow-hidden rounded-[2.15rem] border border-white/90 bg-white p-3 shadow-[0_30px_100px_rgba(126,141,73,0.16)] ring-1 ring-black/5 transition-transform duration-500 ease-out will-change-transform hover:-translate-y-1"
      >
        <div className="pointer-events-none absolute inset-x-6 top-3 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
        <div className="relative aspect-[2/3] overflow-hidden rounded-[1.6rem] bg-[#dfe5d0]">
          <img
            src="/team-hands-reveal.png"
            alt={t.team.featuredImageLabel}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_24%,transparent_64%,rgba(16,24,15,0.14))]" />
          <div className="absolute inset-x-[14%] top-4 h-20 rounded-full bg-white/14 blur-2xl" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#eef1e5]/70 via-[#eef1e51a] to-transparent" />
      </motion.div>
    </motion.div>

    {desktop ? (
      <motion.div
        style={handoffMotionStyle}
        className="pointer-events-none relative z-10 mt-10 flex items-center gap-4 text-[#617236]"
      >
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#b0d64e] to-transparent" />
        <span className="h-2 w-2 rounded-full bg-[#b0d64e]/80" />
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#b0d64e] to-transparent" />
      </motion.div>
    ) : null}
  </div>
);

const TeamSectionDesktop = () => {
  return (
    <section id="team" className="relative scroll-mt-24 overflow-clip bg-[#f7f7f1] pb-24 md:pb-28">
      <SectionBackdrop />

      <div className="relative h-[100dvh]">
        <div
          className="sticky top-0 flex h-[100dvh] items-center overflow-hidden"
          aria-hidden
        />
      </div>
    </section>
  );
};

const TeamSectionMobile = ({
  t,
  reducedMotion,
}: {
  t: TFunction;
  reducedMotion: boolean;
}) => {
  const introRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ['start 75%', 'end 20%'],
  });

  const imageOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, reducedMotion ? 1 : 0.16]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reducedMotion ? 1 : 0.96]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -18]);

  return (
    <section
      id="team"
      className="relative scroll-mt-24 overflow-hidden bg-[#f7f7f1] py-20 md:py-24"
    >
      <SectionBackdrop />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div ref={introRef} className="mx-auto max-w-3xl text-center">
            <TeamIntro
              t={t}
              imageMotionStyle={{ opacity: imageOpacity, scale: imageScale, y: imageY }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const TeamSection: React.FC = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop && !prefersReducedMotion) {
    return <TeamSectionDesktop />;
  }

  return <TeamSectionMobile t={t} reducedMotion={prefersReducedMotion} />;
};
