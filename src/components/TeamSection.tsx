import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Users, User, Shield } from 'lucide-react';

type RoleKey = 'hygienists' | 'assistants' | 'secretaries';

const roleKeys: RoleKey[] = ['hygienists', 'assistants', 'secretaries'];

const initialsFromName = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const MemberChip = ({
  name,
  image,
  label,
}: {
  name: string;
  image: string | null;
  label: string;
}) => (
  <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 shadow-sm transition-all duration-300 hover:bg-white/10 hover:shadow-md hover:-translate-y-0.5">
    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#333333] to-[#222222] shadow-inner ring-1 ring-white/10">
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-heading font-bold text-[#b0d64e]">
          {initialsFromName(name)}
        </div>
      )}
    </div>
    <div className="min-w-0">
      <p className="truncate text-[0.85rem] font-semibold text-white">{name}</p>
      <p className="truncate text-[0.6rem] uppercase tracking-[0.1em] text-gray-400 font-medium">{label}</p>
    </div>
  </div>
);

const DentistCard = ({
  name,
  image,
  label,
  roleLabel,
}: {
  name: string;
  image: string | null;
  label: string;
  roleLabel: string;
}) => (
  <article className="group flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-3.5 shadow-[0_4px_20px_rgb(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:-translate-y-1">
    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[1.125rem] bg-gradient-to-br from-[#333333] to-[#222222] shadow-inner ring-1 ring-white/10">
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3a3a3a] text-lg font-heading font-bold text-[#b0d64e] shadow-sm ring-1 ring-white/10">
            {initialsFromName(name)}
          </div>
        </div>
      )}
    </div>

    <div className="min-w-0 flex-1 py-1">
      <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#b0d64e] font-bold">{label}</p>
      <h3 className="mt-1 text-[1.1rem] font-heading font-bold leading-tight text-white">{name}</h3>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[0.65rem] font-semibold text-gray-300 shadow-sm border border-white/5">
        <User className="h-3.5 w-3.5 text-[#b0d64e]" />
        <span>{roleLabel}</span>
      </p>
    </div>
  </article>
);

const TeamPanel = ({
  title,
  description,
  leadName,
  leadImage,
  groupImage,
  roleLabels,
  members,
  memberGridClassName = 'grid-cols-1 sm:grid-cols-2',
}: {
  title: string;
  description: string;
  leadName: string;
  leadImage: string;
  groupImage?: string;
  roleLabels: Record<RoleKey, string>;
  members: Record<RoleKey, { name: string; image: string | null }[]>;
  memberGridClassName?: string;
}) => (
  <article className="flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20 shadow-[0_4px_20px_rgb(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:bg-black/30">
    {groupImage ? (
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <img
          src={groupImage}
          alt={title}
          className="h-full w-full object-cover object-[50%_22%] origin-[50%_25%] transition-transform duration-700 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent" />
        <div className="absolute left-4 bottom-4 flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 text-[0.7rem] font-bold text-white shadow-md backdrop-blur-sm border border-white/10">
          <span className="h-2 w-2 rounded-full bg-[#b0d64e] animate-pulse" />
          {title}
        </div>
      </div>
    ) : (
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#2a3a18]/40 to-[#1a1a1a]/80 p-5">
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-[#2d2d2d] shadow-sm ring-2 ring-white/10">
            <img src={leadImage} alt={leadName} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </div>
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#b0d64e] font-bold">{title}</p>
            <h3 className="mt-0.5 text-[1.1rem] font-heading font-bold text-white">{leadName}</h3>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#b0d64e]/10 blur-3xl" />
      </div>
    )}

    <div className="flex-1 p-5 bg-black/10">
      <p className="text-[0.8rem] leading-relaxed text-gray-300 mb-6 font-medium">{description}</p>

      <div className="space-y-5">
        {roleKeys.map((role) => (
          members[role].length > 0 && (
            <div key={role}>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-[0.65rem] uppercase tracking-[0.15em] font-bold text-[#b0d64e]/90">
                  {roleLabels[role]}
                </h4>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 shadow-sm text-[0.65rem] font-bold text-white border border-white/10">
                  {members[role].length}
                </span>
              </div>
              <div className={`grid gap-2.5 ${memberGridClassName}`}>
                {members[role].map((member) => (
                  <MemberChip
                    key={member.name}
                    name={member.name}
                    image={member.image}
                    label={roleLabels[role]}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  </article>
);

export const TeamSection: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const roleLabels: Record<RoleKey, string> = {
    hygienists: t.team.hygienists,
    assistants: t.team.assistants,
    secretaries: t.team.secretaries,
  };

  const dentistCards = [
    {
      name: clinicData.dentists[0].name,
      image: clinicData.dentists[0].image,
      label: t.team.team1Title,
    },
    {
      name: clinicData.dentists[1].name,
      image: clinicData.dentists[1].image,
      label: t.team.team2Title,
    },
    {
      name: clinicData.dentists[2].name,
      image: clinicData.dentists[2].image,
      label: t.team.comingSoon,
    },
  ] as const;

  if (isMobile) {
    return <TeamSectionMobile t={t} dentistCards={dentistCards} roleLabels={roleLabels} />;
  }

  return <TeamSectionDesktop t={t} dentistCards={dentistCards} roleLabels={roleLabels} />;
};

const TeamSectionMobile = ({
  t,
  dentistCards,
  roleLabels,
}: {
  t: ReturnType<typeof useLanguage>['t'];
  dentistCards: readonly {
    name: string;
    image: string | null;
    label: string;
  }[];
  roleLabels: Record<RoleKey, string>;
}) => {
  return (
    <section id="team" className="relative scroll-mt-24 overflow-hidden bg-[#fafbfa] py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(232,238,214,0.6),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(244,247,235,0.8),_transparent_40%)]" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/85 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#7e8d49] shadow-sm">
              <Shield className="h-4 w-4" />
              {t.team.featuredImageLabel}
            </span>
            <h2 className="text-section-title font-heading font-bold tracking-tight text-gray-900">
              {t.team.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-gray-600">
              {t.team.subtitle}
            </p>
          </div>

          <div className="mx-auto mt-10 w-full max-w-[20rem]">
            <div className="overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_24px_80px_rgba(126,141,73,0.15)] ring-1 ring-black/5">
              <div className="relative aspect-[2/3]">
                <img
                  src="/team-hands-reveal.png"
                  alt={t.team.featuredImageLabel}
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-5 rounded-[2rem] bg-[#1f1f1f] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 shadow-sm ring-1 ring-white/10">
                <User className="h-5 w-5 text-[#b0d64e]" />
              </div>
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#b0d64e]">
                  {t.team.dentistsTitle}
                </p>
                <h3 className="mt-1 text-xl font-heading font-bold text-white">
                  {t.team.dentistsTitle}
                </h3>
              </div>
            </div>

            <div className="grid gap-4">
              {dentistCards.map((dentist) => (
                <DentistCard
                  key={dentist.name}
                  name={dentist.name}
                  image={dentist.image}
                  label={dentist.label}
                  roleLabel={t.team.dentistRole}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-5 rounded-[2rem] bg-[#1f1f1f] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 shadow-sm ring-1 ring-white/10">
                <Users className="h-5 w-5 text-[#b0d64e]" />
              </div>
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#b0d64e]">
                  {t.team.rostersTitle}
                </p>
                <h3 className="mt-1 text-xl font-heading font-bold text-white">
                  {t.team.rostersTitle}
                </h3>
              </div>
            </div>

            <div className="grid gap-5">
              <TeamPanel
                title={t.team.team1Title}
                description={t.team.team1Desc}
                leadName={clinicData.teams.team1.lead.name}
                leadImage={clinicData.teams.team1.lead.image}
                roleLabels={roleLabels}
                members={clinicData.teams.team1.roles}
                memberGridClassName="grid-cols-1"
              />

              <TeamPanel
                title={t.team.team2Title}
                description={t.team.team2Desc}
                leadName={clinicData.teams.team2.lead.name}
                leadImage={clinicData.teams.team2.lead.image}
                groupImage={clinicData.teams.team2.groupImage}
                roleLabels={roleLabels}
                members={clinicData.teams.team2.roles}
                memberGridClassName="grid-cols-1"
              />
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-2 px-2 text-center text-sm font-medium text-gray-500">
            <p>{t.team.midText1}</p>
            <p>
              {t.team.midText2}{' '}
              <span className="font-bold text-[#7e9c2f]">{t.team.midText3}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamSectionDesktop = ({
  t,
  dentistCards,
  roleLabels,
}: {
  t: ReturnType<typeof useLanguage>['t'];
  dentistCards: readonly {
    name: string;
    image: string | null;
    label: string;
  }[];
  roleLabels: Record<RoleKey, string>;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.34, 0.52], [1, 1, 0], { clamp: false });
  const heroScale = useTransform(scrollYProgress, [0, 0.52], [1, 0.95]);
  const heroTranslateY = useTransform(scrollYProgress, [0, 0.52], [0, -24]);

  const revealOpacity = useTransform(scrollYProgress, [0.24, 0.45, 0.62], [0, 0, 1], { clamp: false });
  const revealTranslateY = useTransform(scrollYProgress, [0.24, 0.62], [72, 0]);

  return (
    <section ref={containerRef} id="team" className="relative h-[330vh] scroll-mt-24 overflow-clip bg-[#fafbfa]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Initial Light Background for Hero Section */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(232,238,214,0.6),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(244,247,235,0.8),_transparent_40%)]" />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[100px]" />

        {/* Fading Dark Theme Background for Reveal Section */}
        <motion.div
          style={{ opacity: revealOpacity }}
          className="absolute inset-0 z-15 bg-[#1a1a1a]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(176,214,78,0.1),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(176,214,78,0.05),_transparent_40%)]" />
          <div className="absolute inset-0 bg-[#222222]/40 backdrop-blur-[100px]" />
        </motion.div>

        {/* Hero Section (Fades Out) */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroTranslateY }}
          className="relative z-10 flex h-full items-center justify-center px-6"
        >
          <div className="w-full max-w-5xl pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[0.7rem] uppercase tracking-[0.2em] text-[#7e8d49] shadow-sm border border-black/5 font-bold mb-6">
                <Shield className="h-4 w-4" />
                {t.team.featuredImageLabel}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 tracking-tight">{t.team.title}</h2>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-gray-600 max-w-2xl mx-auto font-medium">{t.team.subtitle}</p>
            </div>

            <div className="mx-auto mt-12 w-full max-w-[22rem] sm:max-w-[28rem] md:max-w-[32rem]">
              <div className="overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-[0_24px_80px_rgba(126,141,73,0.15)] ring-1 ring-black/5">
                <div className="relative aspect-[2/3]">
                  <img
                    src="/team-hands-reveal.png"
                    alt={t.team.featuredImageLabel}
                    className="h-full w-full object-cover object-center"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revealed Dark Theme Cards (Fades In) */}
        <motion.div
          style={{ opacity: revealOpacity, y: revealTranslateY }}
          className="absolute inset-0 z-20 overflow-hidden px-4 sm:px-8 lg:px-12 pointer-events-none flex flex-col justify-center"
        >
          <div className="container mx-auto max-w-[95rem] pointer-events-auto">
            <div className="mx-auto flex flex-col">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] xl:grid-cols-[0.7fr_1.3fr] max-h-[85vh]">
                {/* Dentists Column */}
                <article className="flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#2a2a2a]/80 shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl ring-1 ring-white/5">
                  <div className="border-b border-white/10 bg-gradient-to-br from-[#1a1a1a]/60 to-[#2a2a2a]/80 p-6 lg:p-8 shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 shadow-sm ring-1 ring-white/10">
                        <User className="h-6 w-6 text-[#b0d64e]" />
                      </div>
                      <div>
                        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-[#b0d64e] font-bold">
                          {t.team.dentistsTitle}
                        </p>
                        <h3 className="text-2xl font-heading font-bold text-white mt-1">
                          {t.team.dentistsTitle}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 p-6 lg:p-8 overflow-y-auto min-h-0 custom-scrollbar">
                    {dentistCards.map((dentist) => (
                      <DentistCard
                        key={dentist.name}
                        name={dentist.name}
                        image={dentist.image}
                        label={dentist.label}
                        roleLabel={t.team.dentistRole}
                      />
                    ))}
                  </div>
                </article>

                {/* Clinical Teams Column */}
                <article className="flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#2a2a2a]/80 shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl ring-1 ring-white/5">
                  <div className="border-b border-white/10 bg-gradient-to-br from-[#1a1a1a]/60 to-[#2a2a2a]/80 p-6 lg:p-8 shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 shadow-sm ring-1 ring-white/10">
                        <Users className="h-6 w-6 text-[#b0d64e]" />
                      </div>
                      <div>
                        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-[#b0d64e] font-bold">
                          {t.team.rostersTitle}
                        </p>
                        <h3 className="text-2xl font-heading font-bold text-white mt-1">
                          {t.team.rostersTitle}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 overflow-y-auto p-6 lg:p-8 xl:grid-cols-2 min-h-0 custom-scrollbar">
                    <TeamPanel
                      title={t.team.team1Title}
                      description={t.team.team1Desc}
                      leadName={clinicData.teams.team1.lead.name}
                      leadImage={clinicData.teams.team1.lead.image}
                      roleLabels={roleLabels}
                      members={clinicData.teams.team1.roles}
                    />

                    <TeamPanel
                      title={t.team.team2Title}
                      description={t.team.team2Desc}
                      leadName={clinicData.teams.team2.lead.name}
                      leadImage={clinicData.teams.team2.lead.image}
                      groupImage={clinicData.teams.team2.groupImage}
                      roleLabels={roleLabels}
                      members={clinicData.teams.team2.roles}
                    />
                  </div>
                </article>
              </div>

              <div className="mx-auto mt-10 max-w-3xl space-y-2 text-center text-sm md:text-base text-gray-400 font-medium pb-6">
                <p>{t.team.midText1}</p>
                <p>
                  {t.team.midText2}{' '}
                  <span className="font-bold text-[#b0d64e]">{t.team.midText3}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
