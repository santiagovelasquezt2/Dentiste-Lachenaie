import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
type TFunction = ReturnType<typeof useLanguage>['t'];
type Dentist = (typeof clinicData.dentists)[number];

const featuredDentists = clinicData.dentists.filter((dentist) => dentist.featured);

const sectionMotion = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.12,
    },
  },
};

const itemMotion = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardPalette = [
  {
    shell:
      'border-white/70 bg-[linear-gradient(180deg,rgba(252,252,249,0.98),rgba(241,242,235,0.94))]',
    glow: 'from-[#f6f8ef] via-white to-[#e9efda]',
    accent: 'from-[#dce8b7] via-[#b8d95f] to-[#5c6f26]',
    portrait: 'bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.9),transparent_36%),linear-gradient(180deg,#eef1e5_0%,#d9e0ca_100%)]',
  },
  {
    shell:
      'border-[#dbe1ce] bg-[linear-gradient(180deg,rgba(249,250,246,0.98),rgba(235,238,229,0.96))]',
    glow: 'from-[#eef5db] via-white to-[#dde7c3]',
    accent: 'from-[#d6dcbf] via-[#8da256] to-[#324314]',
    portrait: 'bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.88),transparent_34%),linear-gradient(180deg,#f4f6ef_0%,#d7ddca_100%)]',
  },
];

const getDentistBio = (t: TFunction, dentist: Dentist) => {
  if (dentist.status === 'coming-soon') return t.team.comingSoonBody;
  if (dentist.teamId === 'team1') return t.team.dentist1Bio;
  if (dentist.teamId === 'team2') return t.team.dentist2Bio;
  return t.team.subtitle;
};

const TeamBackdrop = () => (
  <>
    <div className="absolute inset-0 bg-[#f7f7f1]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(226,235,202,0.92),transparent_36%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.96),transparent_34%),radial-gradient(circle_at_bottom_center,rgba(223,231,209,0.78),transparent_48%)]" />
    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/75 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#ecefe5] to-transparent" />
  </>
);

const TeamCard = ({
  dentist,
  palette,
  t,
  reduceMotion,
}: {
  dentist: Dentist;
  palette: (typeof cardPalette)[number];
  t: TFunction;
  reduceMotion: boolean;
}) => (
  <motion.article
    variants={reduceMotion ? undefined : itemMotion}
    className={`group relative overflow-hidden rounded-[1.445rem] border p-[0.53125rem] shadow-[0_20.4px_57.8px_rgba(77,95,36,0.1)] ring-1 ring-black/5 transition-[background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#5f7f1f]/90 hover:shadow-[0_23.8px_61.2px_rgba(53,79,16,0.18)] md:p-[0.6375rem] ${palette.shell}`}
  >
    <div className={`absolute -inset-px rounded-[1.445rem] bg-gradient-to-br ${palette.glow} opacity-80 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-0`} />
    <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(82,125,23,0.18),rgba(82,125,23,0.08))] opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100" />
    <div className="absolute inset-x-[1.275rem] top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

    <div className="relative flex h-full flex-col rounded-[1.1475rem] bg-[#fcfcf8]/88 p-[0.74375rem] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#e8f2d7] md:p-[0.85rem]">
      <div className="flex items-start justify-between gap-[0.6375rem]">
        <div className="min-w-0">
          <p className="text-[0.527rem] font-medium uppercase tracking-[0.221em] text-[#75815c] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#446016]">
            {t.team.leadDentistLabel}
          </p>
          <h3
            className={cn(
              'mt-[0.425rem] font-heading text-[clamp(1.3175rem,2.3375vw,2.55rem)] leading-[0.94] tracking-[-0.051em] text-[#20251d] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#10170f]',
              dentist.name === 'Dr Marie-Christine St-Onge' ? 'max-w-[15.3ch]' : 'max-w-[10.2ch]'
            )}
          >
            {dentist.name === 'Dr Marie-Christine St-Onge' ? (
              <>
                <span className="block whitespace-nowrap">Dr Marie-Christine</span>
                <span className="block whitespace-nowrap">St-Onge</span>
              </>
            ) : (
              dentist.name
            )}
          </h3>
        </div>

      </div>

      <div
        className={`relative mt-[1.02rem] overflow-hidden rounded-[1.0625rem] ${palette.portrait} min-h-[11.9rem] flex-1 ring-1 ring-black/5 transition-[background-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_10.2px_25.5px_rgba(86,110,29,0.1)] md:min-h-[14.45rem]`}
      >
        <div className={`absolute inset-x-0 bottom-0 h-[5.95rem] bg-gradient-to-t ${palette.accent} opacity-95 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:saturate-150`} />
        <div className="absolute inset-x-[12%] top-[0.6375rem] h-[2.55rem] rounded-full bg-white/45 blur-2xl transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-60" />
        {dentist.image ? (
          <img
            src={dentist.image}
            alt={dentist.name}
            className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-[50%_22%]"
            loading="lazy"
            decoding="async"
          />
        ) : dentist.status === 'coming-soon' ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(248,249,243,0.8),rgba(228,232,219,0.95))]">
            <div className="flex h-[76%] w-[76%] items-center justify-center rounded-[1.19rem] border border-dashed border-[#b8c28f] bg-white/55 px-[1.0625rem] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-[#6f9327] group-hover:bg-[#eef6dd]">
              <div>
                <div className="mx-auto flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-[#dfe6c8] text-center font-heading text-[1.275rem] leading-[1.7rem] tracking-[-0.068em] text-[#334018] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#bfd35b] group-hover:text-[#10170f]">
                  NM
                </div>
                <p className="mt-[0.6375rem] text-[0.561rem] font-medium uppercase tracking-[0.221em] text-[#75815c] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#446016]">
                  {t.team.comingSoon}
                </p>
                <p className="mt-[0.425rem] text-[0.68rem] leading-[1.0625rem] text-[#43503a] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#223013]">
                  {t.team.comingSoonBody}
                </p>
              </div>
            </div>
          </div>
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_24%,transparent_65%,rgba(19,26,17,0.16))]" />
      </div>

      <div className="mt-[1.02rem] flex items-end justify-between gap-[0.6375rem]">
        <div className="max-w-[30.6rem]">
          <p className="text-[0.544rem] font-medium uppercase tracking-[0.17em] text-[#718056] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#446016]">
            {t.team.dentistRole}
          </p>
          <p className="mt-[0.425rem] max-w-[44.2ch] text-[0.68rem] leading-[1.3175] text-[#3e4734] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#223013]">
            {getDentistBio(t, dentist)}
          </p>
        </div>

        <div className="hidden h-px min-w-[3.4rem] flex-1 bg-gradient-to-r from-[#c7d39d] via-[#92a65c] to-transparent opacity-80 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 lg:block" />
      </div>
    </div>
  </motion.article>
);

export const TeamSection: React.FC = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <section
      id="team"
      className="relative scroll-mt-24 overflow-hidden pt-12 md:pt-14 lg:pt-16 pb-20 md:pb-24 lg:pb-28"
    >
      <TeamBackdrop />

      <motion.div
        initial={prefersReducedMotion ? false : 'hidden'}
        whileInView={prefersReducedMotion ? undefined : 'visible'}
        viewport={{ once: true, amount: 0.18 }}
        variants={prefersReducedMotion ? undefined : sectionMotion}
        className="container relative z-10 mx-auto px-4 sm:px-6"
      >
        <div className="mx-auto max-w-[823.65px]">
          <motion.div
            variants={prefersReducedMotion ? undefined : itemMotion}
            className="mx-auto max-w-[47.6rem] text-center"
          >
            <h2 className="text-balance font-heading text-[clamp(2.55rem,5.1vw,5.525rem)] font-normal leading-[0.92] tracking-[-0.0595em] text-[#182015]">
              {t.team.title}
            </h2>
            <p className="mx-auto mt-[1.275rem] max-w-[40.8rem] text-balance text-[0.8925rem] leading-[1.7rem] text-[#3b4434] md:text-[0.9775rem]">
              {t.team.subtitle}
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-[2.55rem] grid gap-[0.85rem] lg:mt-[2.975rem] lg:grid-cols-2 xl:max-w-[1054px] xl:grid-cols-3 xl:gap-[0.6375rem]">
          {featuredDentists.map((dentist, index) => (
            <TeamCard
              key={dentist.name}
              dentist={dentist}
              palette={cardPalette[index % cardPalette.length]}
              t={t}
              reduceMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
