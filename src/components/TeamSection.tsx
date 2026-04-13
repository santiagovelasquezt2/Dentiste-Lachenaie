import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { User, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import { useMediaQuery } from '../hooks/useMediaQuery';

type RoleKey = 'hygienists' | 'assistants' | 'secretaries';
type TFunction = ReturnType<typeof useLanguage>['t'];

type TeamPanelData = {
  id: string;
  title: string;
  description: string;
  summary: string;
  lead: {
    name: string;
    role: string;
    image: string;
  };
  roles: Record<RoleKey, { name: string; image: string | null }[]>;
  supportingImage?: string;
};

type FeaturedDentistData = {
  name: string;
  image: string | null;
  meta: string;
  bio: string;
};

type TeamSectionData = {
  roleLabels: Record<RoleKey, string>;
  featuredDentists: FeaturedDentistData[];
  incomingDentist: {
    name: string;
  } | null;
  teamPanels: TeamPanelData[];
};

const roleKeys: RoleKey[] = ['hygienists', 'assistants', 'secretaries'];

const teamTextById = {
  team1: {
    titleKey: 'team1Title',
    descKey: 'team1Desc',
  },
  team2: {
    titleKey: 'team2Title',
    descKey: 'team2Desc',
  },
} as const;

const dentistCopyByName = {
  "Dr Nathalie Vaillancourt": {
    bioKey: 'dentist1Bio',
    metaKey: 'dentist1Meta',
  },
  "Dr Marie-Christine St-Onge": {
    bioKey: 'dentist2Bio',
    metaKey: 'dentist2Meta',
  },
} as const;

const easeOut = [0.22, 1, 0.36, 1] as const;

const initialsFromName = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const formatTemplate = (template: string, replacements: Record<string, string | number>) =>
  Object.entries(replacements).reduce(
    (result, [key, value]) => result.replace(`{{${key}}}`, String(value)),
    template
  );

const getTeamSectionData = (t: TFunction): TeamSectionData => {
  const roleLabels: Record<RoleKey, string> = {
    hygienists: t.team.hygienists,
    assistants: t.team.assistants,
    secretaries: t.team.secretaries,
  };

  const featuredDentists = clinicData.dentists
    .filter((dentist) => dentist.featured)
    .map((dentist) => {
      const copy = dentistCopyByName[dentist.name as keyof typeof dentistCopyByName];

      return {
        name: dentist.name,
        image: dentist.image,
        bio: t.team[copy.bioKey],
        meta: t.team[copy.metaKey],
      };
    });

  const incomingDentist = clinicData.dentists.find(
    (dentist) => dentist.status === 'coming-soon'
  );

  const teamPanels: TeamPanelData[] = Object.entries(clinicData.teams).map(([teamId, team]) => {
    const totalMembers = roleKeys.reduce(
      (count, role) => count + team.roles[role].length,
      0
    );
    const copy = teamTextById[teamId as keyof typeof teamTextById];

    return {
      ...team,
      id: teamId,
      title: t.team[copy.titleKey],
      description: t.team[copy.descKey],
      summary: formatTemplate(t.team.teamSummaryLabel, { count: totalMembers }),
    };
  });

  return {
    roleLabels,
    featuredDentists,
    incomingDentist: incomingDentist ? { name: incomingDentist.name } : null,
    teamPanels,
  };
};

const sectionRevealProps = (disabled: boolean, delay = 0) =>
  disabled
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18 },
        transition: { duration: 0.75, delay, ease: easeOut },
      };

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
}: {
  t: TFunction;
  imageMotionStyle?: Record<string, unknown>;
  textMotionStyle?: Record<string, unknown>;
}) => (
  <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
    <motion.div style={textMotionStyle} className="w-full">
      <h2 className="text-section-title font-semibold tracking-tight text-gray-900">
        {t.team.title}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-[1.02rem] leading-7 text-gray-600 md:text-lg">
        {t.team.subtitle}
      </p>
    </motion.div>

    <motion.div
      style={imageMotionStyle}
      className="mx-auto mt-10 w-full max-w-[20rem] md:mt-12 md:max-w-[22rem]"
    >
      <div className="overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_24px_80px_rgba(126,141,73,0.15)] ring-1 ring-black/5">
        <div className="relative aspect-[2/3]">
          <img
            src="/team-hands-reveal.png"
            alt={t.team.featuredImageLabel}
            className="h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent" />
        </div>
      </div>
    </motion.div>
  </div>
);

const MemberChip = ({
  name,
  image,
  label,
}: {
  name: string;
  image: string | null;
  label: string;
}) => (
  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#2e2d2c] text-[0.72rem] font-semibold text-[#b0d64e] ring-1 ring-white/10">
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        initialsFromName(name)
      )}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-white">{name}</p>
      <p className="text-[0.68rem] uppercase tracking-[0.16em] text-white/55">{label}</p>
    </div>
  </div>
);

const DentistCard = ({
  t,
  name,
  image,
  meta,
  bio,
}: {
  t: TFunction;
  name: string;
  image: string | null;
  meta: string;
  bio: string;
}) => (
  <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#252423] shadow-[0_28px_64px_rgba(18,18,18,0.16)]">
    <div className="grid gap-6 p-5 sm:grid-cols-[minmax(180px,0.42fr)_minmax(0,1fr)] sm:p-7">
      <div className="overflow-hidden rounded-[1.5rem] bg-[#2d2c2b] ring-1 ring-white/10">
        {image ? (
          <img
            src={image}
            alt={name}
            className="aspect-[4/5] h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(176,214,78,0.18),transparent_55%),linear-gradient(180deg,#32312f,#222220)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/20 text-2xl font-semibold text-[#b0d64e]">
              {initialsFromName(name)}
            </div>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-between">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#b0d64e]">
            {t.team.leadDentistLabel}
          </p>
          <h3 className="mt-3 text-title font-semibold text-white">{name}</h3>
          <div className="mt-4 flex flex-wrap items-center gap-2.5 text-sm text-white/70">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
              <User className="h-3.5 w-3.5 text-[#b0d64e]" />
              {t.team.dentistRole}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1.5 text-white/65">
              {meta}
            </span>
          </div>
          <p className="mt-5 max-w-[34rem] text-[1rem] leading-7 text-white/78">{bio}</p>
        </div>
      </div>
    </div>
  </article>
);

const TeamPanel = ({
  title,
  description,
  lead,
  summary,
  supportingImage,
  supportingImageAlt,
  roleLabels,
  roles,
}: TeamPanelData & {
  supportingImageAlt: string;
  roleLabels: Record<RoleKey, string>;
}) => (
  <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#252423] shadow-[0_28px_64px_rgba(18,18,18,0.14)]">
    <div className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#2d2c2b] ring-1 ring-white/10">
          <img
            src={lead.image}
            alt={lead.name}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#b0d64e]">
            {title}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-white">{lead.name}</h3>
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[0.76rem] font-medium text-white/70">
              {summary}
            </span>
          </div>
          <p className="mt-3 max-w-[36rem] text-sm leading-6 text-white/72">{description}</p>
        </div>
      </div>
    </div>

    <div className="p-5 sm:p-6">
      {supportingImage ? (
        <div className="mb-6 overflow-hidden rounded-[1.5rem] border border-white/10">
          <img
            src={supportingImage}
            alt={supportingImageAlt}
            className="aspect-[16/10] w-full object-cover object-[50%_24%]"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}

      <div className="space-y-5">
        {roleKeys.map((role) =>
          roles[role].length > 0 ? (
            <div key={role}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h4 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#b0d64e]">
                  {roleLabels[role]}
                </h4>
                <span className="inline-flex min-w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[0.72rem] font-semibold text-white/75">
                  {roles[role].length}
                </span>
              </div>
              <div className="grid gap-2.5">
                {roles[role].map((member) => (
                  <MemberChip
                    key={member.name}
                    name={member.name}
                    image={member.image}
                    label={roleLabels[role]}
                  />
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  </article>
);

const TeamCardsContent = ({
  t,
  data,
  reducedMotion,
}: {
  t: TFunction;
  data: TeamSectionData;
  reducedMotion: boolean;
}) => (
  <>
    <motion.div
      {...sectionRevealProps(reducedMotion, 0)}
      className="rounded-[2.25rem] border border-black/5 bg-[#eceee4] p-5 shadow-[0_24px_80px_rgba(70,72,54,0.06)] md:p-7"
    >
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#252423] shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
            <User className="h-5 w-5 text-[#b0d64e]" />
          </div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#7e8d49]">
            {t.team.dentistsTitle}
          </p>
        </div>
        <h3 className="mt-4 text-card-title font-semibold text-gray-900">
          {t.team.dentistsTitle}
        </h3>
        <p className="mt-3 text-[0.98rem] leading-7 text-gray-600">
          {t.team.dentistsIntro}
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {data.featuredDentists.map((dentist) => (
          <DentistCard
            key={dentist.name}
            t={t}
            name={dentist.name}
            image={dentist.image}
            meta={dentist.meta}
            bio={dentist.bio}
          />
        ))}
      </div>

      {data.incomingDentist ? (
        <div className="mt-5 rounded-[1.7rem] border border-[#d6dcc2] bg-white/75 px-5 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7e8d49]">
            {t.team.comingSoon}
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {t.team.comingSoonTitle}: {data.incomingDentist.name}
              </h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {t.team.comingSoonBody}
              </p>
            </div>
            <span className="inline-flex self-start rounded-full border border-[#d6dcc2] bg-[#f8f8f2] px-3 py-1.5 text-sm text-gray-700">
              {t.team.dentistRole}
            </span>
          </div>
        </div>
      ) : null}
    </motion.div>

    <motion.div
      {...sectionRevealProps(reducedMotion, reducedMotion ? 0 : 0.08)}
      className="mt-8 rounded-[2.25rem] border border-black/5 bg-[#eceee4] p-5 shadow-[0_24px_80px_rgba(70,72,54,0.06)] md:p-7"
    >
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#252423] shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
            <Users className="h-5 w-5 text-[#b0d64e]" />
          </div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#7e8d49]">
            {t.team.rostersTitle}
          </p>
        </div>
        <h3 className="mt-4 text-card-title font-semibold text-gray-900">
          {t.team.rostersTitle}
        </h3>
        <p className="mt-3 text-[0.98rem] leading-7 text-gray-600">
          {t.team.rostersIntro}
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {data.teamPanels.map((team) => (
          <TeamPanel
            key={team.id}
            {...team}
            roleLabels={data.roleLabels}
            supportingImageAlt={team.supportingImage ? t.team.supportingImageCaption : ''}
          />
        ))}
      </div>
    </motion.div>
  </>
);

const TeamSectionDesktop = ({
  t,
  data,
}: {
  t: TFunction;
  data: TeamSectionData;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const introTextOpacity = useTransform(scrollYProgress, [0, 0.08, 0.56, 0.72], [0, 1, 1, 0.28]);
  const introTextY = useTransform(scrollYProgress, [0, 0.1, 0.72], [36, 0, -18]);
  const imageOpacity = useTransform(scrollYProgress, [0.12, 0.34, 0.54, 0.66], [1, 1, 0.18, 0]);
  const imageScale = useTransform(scrollYProgress, [0.12, 0.54, 0.66], [1, 0.97, 0.92]);
  const imageY = useTransform(scrollYProgress, [0.1, 0.54, 0.66], [12, 0, -44]);
  const contentOpacity = useTransform(scrollYProgress, [0.62, 0.82, 1], [0, 0.28, 1]);
  const contentY = useTransform(scrollYProgress, [0.62, 0.82, 1], [96, 48, 0]);
  const contentScale = useTransform(scrollYProgress, [0.62, 1], [0.98, 1]);

  return (
    <section id="team" className="relative scroll-mt-24 overflow-clip bg-[#f7f7f1]">
      <SectionBackdrop />

      <div ref={containerRef} className="relative h-[240vh]">
        <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <TeamIntro
              t={t}
              textMotionStyle={{ opacity: introTextOpacity, y: introTextY }}
              imageMotionStyle={{ opacity: imageOpacity, scale: imageScale, y: imageY }}
            />
          </div>
        </div>
      </div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}
        className="relative z-20 -mt-[12vh] pb-24 md:pb-28"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <TeamCardsContent t={t} data={data} reducedMotion={false} />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const TeamSectionMobile = ({
  t,
  data,
  reducedMotion,
}: {
  t: TFunction;
  data: TeamSectionData;
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

          <div className="mt-12">
            <TeamCardsContent t={t} data={data} reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const TeamSection: React.FC = () => {
  const { t } = useLanguage();
  const data = getTeamSectionData(t);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop && !prefersReducedMotion) {
    return <TeamSectionDesktop t={t} data={data} />;
  }

  return <TeamSectionMobile t={t} data={data} reducedMotion={prefersReducedMotion} />;
};
