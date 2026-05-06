import drMarieChristineStOnge from '@/DentalContent/Images/Team/Dentists/dentist-dr-marie-christine-st-onge.jpg';
import drMarieChristineStOngeBubble from '@/DentalContent/Images/Team/Dentists/dentist-dr-marie-christine-st-onge-new.png';
import drNathalieVaillancourt from '@/DentalContent/Images/Team/Dentists/dentist-dr-nathalie-vaillancourt.jpg';
import teamDrStOngeGroupPhoto from '@/DentalContent/Images/Team/Dr. Marie-Christine St-Onge\'s Team/team-dr-st-onge-group-photo.jpg';
import staffAudreyRoy from '@/DentalContent/Images/Team/Team/staff-audrey-roy.jpg';
import staffElizabethCiricillo from '@/DentalContent/Images/Team/Team/staff-elizabeth-ciricillo.jpg';
import staffVirginieCuradeau from '@/DentalContent/Images/Team/Team/staff-virginie-curadeau.jpg';
import staffYaminaBounessis from '@/DentalContent/Images/Team/Team/staff-yamina-bounessis.jpg';
import clinicExteriorHero from '@/DentalContent/Images/Ouside of the building/clinic-exterior-front-signage-hero.png';

type TeamMember = {
  name: string;
  image: string | null;
};

type TeamBucket = {
  hygienists: TeamMember[];
  assistants: TeamMember[];
  secretaries: TeamMember[];
};

type DentistProfile = {
  name: string;
  role: string;
  bio: string;
  image: string | null;
  featured: boolean;
  status: 'active' | 'coming-soon';
  teamId?: 'team1' | 'team2';
};

export const clinicData = {
  name: "Centre dentaire Vaillancourt St-Onge",
  phone: "(450) 582-2219",
  email: "info@dentistelachenaie.com",
  address: "355, Montée des Pionniers, suite 201, Terrebonne, Qc J6V 1N5",
  /** [longitude, latitude] for MapLibre / mapcn (Montée des Pionniers, Terrebonne) */
  mapCenter: [-73.5123831, 45.7138807] as [number, number],
  mapZoom: 15,
  hours: {
    monday: "8:00 - 20:00",
    tuesday: "8:00 - 19:30",
    wednesday: "12:00 - 20:00",
    thursday: "8:00 - 20:00",
    friday: "8:00 - 16:00",
    saturday: "Fermé",
    sunday: "Fermé",
  },
  dentists: [
    {
      name: "Dr Nathalie Vaillancourt",
      role: "Dentist",
      bio: "A graduate of l'Université de Montréal and practicing since 1999, Dr Nathalie Vaillancourt has been at the clinic since its founding. She is surrounded by Yamina, Élizabeth and Anne-Sophie, dental hygienists; Audrey and Virginie, dental assistants; and Marie-Pier and Marjolaine, secretary-receptionists.",
      image: drNathalieVaillancourt,
      featured: true,
      status: "active",
      teamId: "team1",
    },
    {
      name: "Dr Marie-Christine St-Onge",
      role: "Dentist",
      bio: "Graduate of l'Université Laval in 1998, Dre Marie-Christine St-Onge has been with the clinic since 2001. Her team includes Sylvie, Myrlène and Éveline, dental hygienists; Martine and Marie-Pier, dental assistants; and Nathalie and Diane, secretary-receptionists.",
      image: drMarieChristineStOnge,
      featured: true,
      status: "active",
      teamId: "team2",
    },
    {
      name: "Dr Nadeige Moquin",
      role: "Dentist",
      bio: "Dr Nadeige Moquin will join this section once profile photography is ready.",
      image: null,
      featured: true,
      status: "coming-soon",
    }
  ] satisfies DentistProfile[],
  teams: {
    team1: {
      lead: {
        name: "Dr Nathalie Vaillancourt",
        role: "Dentist",
        image: drNathalieVaillancourt,
      },
      roles: {
        hygienists: [
          { name: "Yamina", image: staffYaminaBounessis },
          { name: "Élizabeth", image: staffElizabethCiricillo },
          { name: "Anne-Sophie", image: null },
        ],
        assistants: [
          { name: "Audrey", image: staffAudreyRoy },
          { name: "Virginie", image: staffVirginieCuradeau },
        ],
        secretaries: [
          { name: "Marie-Pier", image: null },
          { name: "Marjolaine", image: null },
        ],
      } satisfies TeamBucket,
    },
    team2: {
      lead: {
        name: "Dr Marie-Christine St-Onge",
        role: "Dentist",
        image: drMarieChristineStOnge,
      },
      supportingImage: teamDrStOngeGroupPhoto,
      roles: {
        hygienists: [
          { name: "Sylvie", image: null },
          { name: "Myrlène", image: null },
          { name: "Éveline", image: null },
        ],
        assistants: [
          { name: "Martine", image: null },
          { name: "Marie-Pier", image: null },
        ],
        secretaries: [
          { name: "Nathalie", image: null },
          { name: "Diane", image: null },
        ],
      } satisfies TeamBucket,
    },
  },
  services: [
    { id: "orthodontics", icon: "dot" },
    { id: "prevention", icon: "dot" },
    { id: "pediatric", icon: "dot" },
    { id: "restoration", icon: "dot" },
    { id: "implants", icon: "dot" },
    { id: "emergency", icon: "dot" },
    { id: "surgery", icon: "dot" },
    { id: "cosmetic", icon: "dot" },
  ],
  /** Numeric facts surfaced in marketing copy (e.g. "+10 employees", "Since 2000"). */
  stats: {
    foundingYear: 2000,
    employeeCount: 10,
  },
  /**
   * Catalog of clinic-specific asset paths. New clinics swap the imported source files
   * (or replace these import paths) — components consume from here, not from direct imports.
   */
  assets: {
    /** Primary logo, served from `public/assets/`. Used in Nav. */
    logoPrimary: `${import.meta.env.BASE_URL}assets/clinic-logo-primary.png`,
    /** Hero reveal video — short clip of the logo on a white background. */
    heroVideo: `${import.meta.env.BASE_URL}assets/hero-reveal.mp4`,
    /** Wide exterior shot of the clinic, used as the left side of the hero. */
    heroExterior: clinicExteriorHero,
    /** Bubble-pair images used by the "Our Goal" section. */
    teamBubbles: {
      left: drMarieChristineStOngeBubble,
      right: drNathalieVaillancourt,
    },
    /** First-visit patient intake PDF, served from `public/assets/`. */
    firstVisitPdf: `${import.meta.env.BASE_URL}assets/formulaire-premiere-visite.pdf`,
    /** Gloved-fingers reveal image (TeamSection scroll reveal). Glove color must match brand. */
    teamHandsReveal: `${import.meta.env.BASE_URL}team-hands-reveal.png`,
  },
};
