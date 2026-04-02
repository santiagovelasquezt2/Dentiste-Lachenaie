import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { clinicData } from '../content/clinic';
import { User } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="team" className="bg-bg-dark py-32 text-bg-inverse overflow-hidden reveal-on-scroll">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-section-title font-bold mb-6">
            {t.team.title.split('Our Team')[0]}<span className="text-accent">Our Team</span>
            {/* Fallback for French */}
            {t.team.title.includes('notre équipe') && (
              <>{t.team.title.split('notre équipe')[0]}<span className="text-accent">notre équipe</span></>
            )}
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            {t.team.subtitle}
          </p>
        </div>

        {/* Dentists - Premium Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {clinicData.dentists.map((dentist) => (
            <div 
              key={dentist.name}
              className="group relative bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] rounded-3xl p-8 border border-accent/20 hover:border-accent/40 transition-all duration-500 overflow-hidden flex flex-col items-center text-center"
            >
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-accent/20 group-hover:border-accent transition-all duration-500 bg-bg-alt">
                <img 
                  src={dentist.image} 
                  alt={dentist.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="text-2xl font-heading font-bold text-accent mb-2">
                {dentist.name}
              </h3>
              <span className="text-sm text-bg-inverse/50 uppercase tracking-wider mb-6">{dentist.role}</span>
              <p className="text-bg-inverse/70 leading-relaxed text-sm">
                {dentist.bio}
              </p>
              
              {/* Background Accent */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-700" />
            </div>
          ))}
        </div>

        {/* Mid Text */}
        <div className="text-center mb-24 space-y-4">
          <p className="text-2xl font-heading text-bg-inverse">{t.team.midText1}</p>
          <p className="text-text-light">{t.team.midText2}</p>
          <p className="text-text-light">{t.team.midText3}</p>
        </div>

        {/* Teams Breakdown & Photos */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-start">
          
          {/* Team 1 (Nathalie Vaillancourt) */}
          <div className="flex flex-col">
            <div className="mb-12 text-center lg:text-left">
              <h4 className="text-2xl font-bold text-accent mb-4">{t.team.team1Title}</h4>
              <p className="text-bg-inverse/70 text-sm leading-relaxed">{t.team.team1Desc}</p>
            </div>
            
            <div className="space-y-12">
              {/* Hygienists */}
              <div>
                <h5 className="text-nav text-accent/60 mb-6 text-center lg:text-left">{t.team.hygienists}</h5>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  {clinicData.staff.hygienists.map((member) => (
                    <div key={member.name} className="flex flex-col items-center gap-3 group w-28">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-accent/10 group-hover:border-accent transition-all duration-500 bg-[#2a2a2a] flex items-center justify-center">
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        ) : (
                          <div className="text-center p-2">
                            <User className="w-6 h-6 mx-auto mb-1 text-bg-inverse/30" />
                            <span className="text-[10px] text-bg-inverse/50 font-medium leading-tight block">{t.team.comingSoon}</span>
                          </div>
                        )}
                      </div>
                      <span className="font-heading font-medium text-sm group-hover:text-accent transition-colors text-center">
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assistants */}
              <div>
                <h5 className="text-nav text-accent/60 mb-6 text-center lg:text-left">{t.team.assistants}</h5>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  {clinicData.staff.assistants.map((member) => (
                    <div key={member.name} className="flex flex-col items-center gap-3 group w-28">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-accent/10 group-hover:border-accent transition-all duration-500 bg-[#2a2a2a] flex items-center justify-center">
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        ) : (
                          <div className="text-center p-2">
                            <User className="w-6 h-6 mx-auto mb-1 text-bg-inverse/30" />
                            <span className="text-[10px] text-bg-inverse/50 font-medium leading-tight block">{t.team.comingSoon}</span>
                          </div>
                        )}
                      </div>
                      <span className="font-heading font-medium text-sm group-hover:text-accent transition-colors text-center">
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secretaries */}
              <div>
                <h5 className="text-nav text-accent/60 mb-6 text-center lg:text-left">{t.team.secretaries}</h5>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  {clinicData.staff.secretaries.map((member) => (
                    <div key={member.name} className="flex flex-col items-center gap-3 group w-28">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-accent/10 group-hover:border-accent transition-all duration-500 bg-[#2a2a2a] flex items-center justify-center">
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        ) : (
                          <div className="text-center p-2">
                            <User className="w-6 h-6 mx-auto mb-1 text-bg-inverse/30" />
                            <span className="text-[10px] text-bg-inverse/50 font-medium leading-tight block">{t.team.comingSoon}</span>
                          </div>
                        )}
                      </div>
                      <span className="font-heading font-medium text-sm group-hover:text-accent transition-colors text-center">
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Team 2 (Marie-Christine St-Onge) */}
          <div className="flex flex-col">
            <div className="mb-12 text-center lg:text-left">
              <h4 className="text-2xl font-bold text-accent mb-4">{t.team.team2Title}</h4>
              <p className="text-bg-inverse/70 text-sm leading-relaxed">{t.team.team2Desc}</p>
            </div>
            
            <div className="rounded-3xl overflow-hidden border-4 border-accent/20 shadow-2xl group">
              <img 
                src={clinicData.staff.team2GroupImage} 
                alt="Team Marie-Christine St-Onge" 
                className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
