import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';

type RoleKey = 'hygienists' | 'assistants' | 'secretaries';

const roleKeys: RoleKey[] = ['hygienists', 'assistants', 'secretaries'];

const MemberBadge = ({
  name,
  image,
  comingSoon,
}: {
  name: string;
  image: string | null;
  comingSoon: string;
}) => (
  <div className="rounded-2xl border border-border/80 bg-white/90 p-3 shadow-sm">
    <div className="mb-2 aspect-square w-full overflow-hidden rounded-xl bg-bg-alt">
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs uppercase tracking-[0.12em] text-text-light">
          {comingSoon}
        </div>
      )}
    </div>
    <p className="text-sm font-semibold text-text">{name}</p>
  </div>
);

export const TeamSection: React.FC = () => {
  const { t } = useLanguage();

  const teams = [
    {
      key: 'team1',
      title: t.team.team1Title,
      description: t.team.team1Desc,
      data: clinicData.teams.team1,
      showGroupImage: false,
    },
    {
      key: 'team2',
      title: t.team.team2Title,
      description: t.team.team2Desc,
      data: clinicData.teams.team2,
      showGroupImage: true,
    },
  ] as const;

  const roleLabels: Record<RoleKey, string> = {
    hygienists: t.team.hygienists,
    assistants: t.team.assistants,
    secretaries: t.team.secretaries,
  };

  return (
    <section id="team" className="bg-bg py-24 reveal-on-scroll">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <h2 className="text-section-title font-bold text-text">{t.team.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-text-light">{t.team.subtitle}</p>
        </div>

        <div className="grid gap-10">
          {teams.map((team) => (
            <article
              key={team.key}
              className="rounded-3xl border border-border/70 bg-white/75 p-6 shadow-sm md:p-8"
            >
              <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl bg-bg-alt">
                    <img
                      src={team.data.lead.image}
                      alt={team.data.lead.name}
                      className="aspect-[4/5] w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {team.showGroupImage && team.data.groupImage ? (
                    <div className="overflow-hidden rounded-2xl bg-bg-alt">
                      <img
                        src={team.data.groupImage}
                        alt={team.title}
                        className="aspect-[4/3] w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : null}
                </div>

                <div>
                  <h3 className="text-3xl font-heading text-text">{team.title}</h3>
                  <p className="mt-3 max-w-3xl text-text-light">{team.description}</p>

                  <div className="mt-7 space-y-7">
                    {roleKeys.map((role) => (
                      <div key={role}>
                        <h4 className="mb-3 text-sm font-nav uppercase tracking-[0.16em] text-accent">
                          {roleLabels[role]}
                        </h4>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {team.data.roles[role].map((member) => (
                            <MemberBadge
                              key={member.name}
                              name={member.name}
                              image={member.image}
                              comingSoon={t.team.comingSoon}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl text-center text-text-light">
          <p>{t.team.midText1}</p>
          <p>{t.team.midText2}</p>
          <p className="font-semibold text-text">{t.team.midText3}</p>
        </div>
      </div>
    </section>
  );
};
