import React, { useRef } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
type TFunction = ReturnType<typeof useLanguage>['t'];
type Dentist = (typeof clinicData.dentists)[number];

const featuredDentists = clinicData.dentists.filter((dentist) => dentist.featured);

const cardPalette = [
  {
    shell:
      'border-white/70 bg-[linear-gradient(180deg,rgba(252,252,249,0.98),rgba(241,242,235,0.94))]',
    glow: 'from-[#f6f8ef] via-white to-[#e9efda]',
    accent: 'from-brand-soft via-brand-mid to-brand-shade',
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
    <div className="absolute inset-0 bg-white" />
    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
  </>
);

const TeamCard = ({
  dentist,
  palette,
  t,
}: {
  dentist: Dentist;
  palette: (typeof cardPalette)[number];
  t: TFunction;
}) => (
  <article
    className={`group relative overflow-hidden rounded-[1.445rem] border p-[0.53125rem] shadow-[0_20.4px_57.8px_rgba(77,95,36,0.1)] ring-1 ring-black/5 transition-[background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-brand-darkest/90 hover:shadow-[0_23.8px_61.2px_rgba(53,79,16,0.18)] md:p-[0.6375rem] ${palette.shell}`}
  >
    <div className={`absolute -inset-px rounded-[1.445rem] bg-gradient-to-br ${palette.glow} opacity-80 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-0`} />
    <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(82,125,23,0.18),rgba(82,125,23,0.08))] opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100" />
    <div className="absolute inset-x-[1.275rem] top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

    <div className="relative flex h-full flex-col rounded-[1.1475rem] bg-[#fcfcf8]/88 p-[0.74375rem] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#e8f2d7] md:p-[0.85rem]">
      <div className="flex items-start justify-between gap-[0.6375rem]">
        <div className="min-w-0">
          <p className="text-[0.527rem] font-medium uppercase tracking-[0.221em] text-[#75815c] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#446016]">
            {dentist.status === 'coming-soon' ? t.team.dentistRole : t.team.leadDentistLabel}
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
  </article>
);

type StaffMember = { name: string; image: string | null };

const StaffCard = ({
  member,
  palette,
  t,
}: {
  member: StaffMember;
  palette: (typeof cardPalette)[number];
  t: TFunction;
}) => (
  <article
    className={`group relative overflow-hidden rounded-[1.02rem] border p-[0.34rem] shadow-[0_12px_32px_rgba(77,95,36,0.08)] ring-1 ring-black/5 transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-brand-darkest/90 hover:shadow-[0_14px_36px_rgba(53,79,16,0.16)] ${palette.shell}`}
  >
    <div className={`absolute -inset-px rounded-[1.02rem] bg-gradient-to-br ${palette.glow} opacity-80 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-0`} />
    <div className="absolute inset-x-[0.85rem] top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

    <div className="relative flex flex-col rounded-[0.76rem] bg-[#fcfcf8]/90 p-[0.425rem] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#e8f2d7]">
      <div
        className={`relative overflow-hidden rounded-[0.595rem] ${palette.portrait} aspect-square ring-1 ring-black/5`}
      >
        <div className={`absolute inset-x-0 bottom-0 h-[2.55rem] bg-gradient-to-t ${palette.accent} opacity-90 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:saturate-150`} />
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(248,249,243,0.85),rgba(228,232,219,0.95))]">
            <p className="px-2 text-center font-heading text-[0.78rem] leading-[1.02rem] tracking-[-0.04em] text-[#334018] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#10170f]">
              {t.team.comingSoon}
            </p>
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_24%,transparent_65%,rgba(19,26,17,0.16))]" />
      </div>
      <p className="mt-[0.425rem] text-center font-heading text-[0.85rem] leading-[1.1] tracking-[-0.03em] text-[#20251d] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#10170f]">
        {member.name}
      </p>
    </div>
  </article>
);

const StaffGroup = ({
  heading,
  members,
  palette,
  t,
}: {
  heading: string;
  members: StaffMember[];
  palette: (typeof cardPalette)[number];
  t: TFunction;
}) => (
  <div>
    <h4 className="mb-[0.85rem] text-center font-heading text-[clamp(1.02rem,1.53vw,1.3175rem)] leading-[1.1] tracking-[-0.04em] text-[#20251d]">
      {heading}
    </h4>
    <div
      className={cn(
        'grid gap-[0.6375rem]',
        members.length === 2
          ? 'mx-auto w-full max-w-[18.75rem] grid-cols-2'
          : 'grid-cols-2 sm:grid-cols-3'
      )}
    >
      {members.map((member) => (
        <StaffCard key={member.name} member={member} palette={palette} t={t} />
      ))}
    </div>
  </div>
);

const TeamSpotlight = ({
  heading,
  image,
  alt,
  palette,
}: {
  heading: string;
  image: string;
  alt: string;
  palette: (typeof cardPalette)[number];
}) => (
  <div className="flex flex-col gap-[0.85rem]">
    <h4 className="text-center font-heading text-[clamp(1.02rem,1.53vw,1.3175rem)] leading-[1.1] tracking-[-0.04em] text-[#20251d]">
      {heading}
    </h4>
    <article
      className={`group relative overflow-hidden rounded-[1.02rem] border p-[0.34rem] shadow-[0_12px_32px_rgba(77,95,36,0.08)] ring-1 ring-black/5 transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-brand-darkest/90 hover:shadow-[0_14px_36px_rgba(53,79,16,0.16)] ${palette.shell}`}
    >
      <div className={`absolute -inset-px rounded-[1.02rem] bg-gradient-to-br ${palette.glow} opacity-80 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-0`} />
      <div className="relative flex flex-col rounded-[0.76rem] bg-[#fcfcf8]/90 p-[0.425rem] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#e8f2d7]">
        <div className={`relative overflow-hidden rounded-[0.595rem] ${palette.portrait} aspect-[4/3] ring-1 ring-black/5`}>
          <div className={`absolute inset-x-0 bottom-0 h-[2.55rem] bg-gradient-to-t ${palette.accent} opacity-90 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:saturate-150`} />
          <img
            src={image}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_24%,transparent_65%,rgba(19,26,17,0.16))]" />
        </div>
      </div>
    </article>
  </div>
);

const TeamRoster = ({
  teamId,
  palette,
  t,
}: {
  teamId: 'team1' | 'team2';
  palette: (typeof cardPalette)[number];
  t: TFunction;
}) => {
  const team = clinicData.teams[teamId];
  return (
    <div className="flex flex-col gap-[1.7rem]">
      <StaffGroup heading={t.team.hygienists} members={team.roles.hygienists} palette={palette} t={t} />
      <StaffGroup heading={t.team.assistants} members={team.roles.assistants} palette={palette} t={t} />
      <StaffGroup heading={t.team.secretaries} members={team.roles.secretaries} palette={palette} t={t} />
    </div>
  );
};

export const TeamSection: React.FC = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const pinRef = useRef<HTMLDivElement>(null);

  // The pin wrapper is ~220vh tall: 100vh of sticky + ~120vh of scroll to
  // drive the wipe. When the wipe finishes the sticky releases and the cards
  // (rendered in normal flow below) flow straight into the next section
  // without a pinned "dead zone".
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end'],
  });

  // Smooth the raw scroll progress with a spring so the mask motion is less
  // tied to scroll-wheel granularity (trackpad/wheel events can be jittery).
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.35,
  });

  // Timeline (0 → 1 over the pin):
  //   0.00 – 0.08  hold: image fully visible
  //   0.08 – 0.50  image erases top→bottom
  //   0.42 – 0.92  cards reveal bottom→top (slight overlap for smoother hand-off)
  //   0.92 – 1.00  cards fully visible, sticky releases shortly after
  const imageLine = useTransform(smoothProgress, [0.08, 0.5], [-10, 110]);
  const imageMask = useMotionTemplate`linear-gradient(to bottom, transparent calc(${imageLine}% - 6%), #000 calc(${imageLine}% + 6%))`;
  const imageOpacity = useTransform(smoothProgress, [0.46, 0.52], [1, 0]);

  // End at -25% so the 6% feather fully exits the top of the layer, leaving
  // the top row of cards fully opaque (no soft cutoff at settle).
  const cardsLine = useTransform(smoothProgress, [0.42, 0.92], [115, -25]);
  const cardsMask = useMotionTemplate`linear-gradient(to bottom, transparent calc(${cardsLine}% - 6%), #000 calc(${cardsLine}% + 6%))`;

  return (
    <section id="team" className="relative bg-white">
      {/* Pin wrapper — taller than viewport so the sticky child has scroll
          distance to drive the wipe. Height = 100vh sticky + ~120vh of drive. */}
      <div ref={pinRef} className="relative h-[220vh]">
        <div className="sticky top-0 h-screen overflow-clip flex flex-col">
          <TeamBackdrop />
          {/* Title row */}
          <div className="relative z-30 shrink-0 px-4 pt-20 pb-5 text-center sm:px-6 sm:pt-24 md:pt-28 md:pb-6 lg:pt-32">
            <div className="mx-auto max-w-[47.6rem]">
              <h2 className="text-balance font-heading text-[clamp(2.55rem,5.1vw,5.525rem)] font-normal leading-[0.92] tracking-[-0.0595em] text-[#182015]">
                {t.team.title}
              </h2>
              <p className="mx-auto mt-[1.275rem] max-w-[40.8rem] text-balance text-[0.8925rem] leading-[1.7rem] text-[#3b4434] md:text-[0.9775rem]">
                {t.team.subtitle}
              </p>
            </div>
          </div>

          {/* Hero image + dentist cards share the remaining space during the
              wipe. Once the wipe finishes the same cards are re-rendered in
              normal flow below so the section extends naturally. */}
          <div className="relative z-10 flex-1 overflow-clip">
            <motion.div
              style={
                prefersReducedMotion
                  ? undefined
                  : {
                      WebkitMaskImage: imageMask,
                      maskImage: imageMask,
                      WebkitMaskSize: '100% 100%',
                      maskSize: '100% 100%',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      opacity: imageOpacity,
                      willChange: 'mask-image, -webkit-mask-image, opacity',
                      transform: 'translateZ(0)',
                    }
              }
              className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 pb-8"
            >
              <img
                src="/assets/team-hero.png"
                alt=""
                aria-hidden="true"
                className="block h-auto max-h-full w-auto max-w-[min(70vw,432px)] rounded-2xl object-contain shadow-2xl"
              />
            </motion.div>

            {/* Featured dentist cards — revealed during the wipe */}
            <motion.div
              style={
                prefersReducedMotion
                  ? undefined
                  : {
                      WebkitMaskImage: cardsMask,
                      maskImage: cardsMask,
                      WebkitMaskSize: '100% 100%',
                      maskSize: '100% 100%',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      willChange: 'mask-image, -webkit-mask-image',
                      transform: 'translateZ(0)',
                    }
              }
              className="absolute inset-0 flex items-center justify-center px-4 pt-6 pb-10 sm:px-6"
            >
              <div className="mx-auto w-full max-w-[1054px]">
                <div className="grid w-full gap-[0.85rem] lg:grid-cols-2 xl:grid-cols-3 xl:gap-[0.6375rem]">
                  {featuredDentists.map((dentist, index) => (
                    <TeamCard
                      key={dentist.name}
                      dentist={dentist}
                      palette={cardPalette[index % cardPalette.length]}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Staff rosters extend the section in natural flow. Background matches
          the sticky panel exactly so both areas read as one continuous block. */}
      <div className="relative px-4 pt-10 pb-24 sm:px-6 md:pt-16 md:pb-32 bg-white">
        <div className="mx-auto w-full max-w-[1054px]">
          <div className="grid w-full gap-[1.7rem] lg:grid-cols-2">
            <TeamRoster teamId="team1" palette={cardPalette[0]} t={t} />
            <TeamSpotlight
              heading={t.team.sectionHeading}
              image={clinicData.teams.team2.supportingImage}
              alt={t.team.supportingImageCaption}
              palette={cardPalette[1]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
