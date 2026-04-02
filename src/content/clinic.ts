export const clinicData = {
  phone: "(450) 582-2219",
  email: "info@dentistelachenaie.com",
  address: "355, Montée des Pionniers, suite 201, Terrebonne, Qc J6V 1N5",
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
      bio: "A graduate of l'Université de Montréal and practicing since 1999, Dr. Nathalie Vaillancourt has been at the clinic since its founding. She is assisted by dental hygienists Joannie and Myriam; dental assistant Audrey; and receptionists Martine and Manon.",
      image: "https://ui-avatars.com/api/?name=Nathalie+Vaillancourt&background=F4F4F4&color=333333&size=512&font-size=0.3",
    },
    {
      name: "Dr Marie-Christine St-Onge",
      role: "Dentist",
      bio: "Graduate of l'Université Laval in 1998, Dre Marie-Christine St-Onge has been with the clinic since 2001. Dr Nadeige Moquin Charbonneau joined the practice a few years later. Their team members are dental hygienists Sylvie, Myrlène and Éveline; dental assistants Martine and Marie-Pier; and receptionists Nathalie and Diane.",
      image: "https://ui-avatars.com/api/?name=Marie-Christine+St-Onge&background=F4F4F4&color=333333&size=512&font-size=0.3",
    },
    {
      name: "Dr Nadeige Moquin",
      role: "Dentist",
      bio: "Texte à venir",
      image: "https://ui-avatars.com/api/?name=Nadeige+Moquin&background=F4F4F4&color=333333&size=512&font-size=0.3",
    }
  ],
  staff: {
    team2GroupImage: "https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?q=80&w=2070&auto=format&fit=crop",
    hygienists: [
      { name: "Élizabeth", image: "https://ui-avatars.com/api/?name=Elizabeth&background=F4F4F4&color=333333&size=256" },
      { name: "Yamina", image: "https://ui-avatars.com/api/?name=Yamina&background=F4F4F4&color=333333&size=256" },
      { name: "Anne-Sophie", image: null }, // null means "Pictures coming soon"
    ],
    assistants: [
      { name: "Audrey", image: "https://ui-avatars.com/api/?name=Audrey&background=F4F4F4&color=333333&size=256" },
      { name: "Virginie", image: "https://ui-avatars.com/api/?name=Virginie&background=F4F4F4&color=333333&size=256" },
    ],
    secretaries: [
      { name: "Johanne", image: null },
      { name: "Gina", image: null },
    ]
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
  ]
};
