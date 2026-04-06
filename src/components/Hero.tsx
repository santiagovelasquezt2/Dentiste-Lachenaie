import React from 'react';
import { motion, type Variants } from 'framer-motion';
import clinicExteriorHero from '@/DentalContent/Images/Ouside of the building/clinic-exterior-front-signage-01.jpg';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './Button';
import { Play } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col lg:flex-row bg-[#fafbfa] overflow-hidden">
      {/* Left Side: Content */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-32 lg:py-0 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-gray-900 leading-[1.1] tracking-tight mb-12"
          >
            {t.logoVideo.quote}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-600 mb-16 max-w-md leading-relaxed font-medium"
          >
            {t.hero.body}
          </motion.p>

          <motion.div variants={itemVariants}>
            <Button 
              size="lg" 
              pill={true}
              onClick={() => window.location.href = '#appointment'}
              className="bg-[#b0d64e] text-white hover:bg-[#9cbd42] transition-all duration-300 px-12 py-7 text-lg font-bold shadow-lg shadow-[#b0d64e]/20"
            >
              {t.firstVisit.button}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side: Image */}
      <div className="flex-1 relative min-h-[50vh] lg:min-h-screen">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#fafbfa] via-transparent to-transparent hidden lg:block w-32" />
        <img
          src={clinicExteriorHero}
          alt="Clinic Exterior"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Center Overlay: Video/Action */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute top-1/2 left-1/2 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block"
      >
        <div className="relative group cursor-pointer">
          <div className="w-64 h-48 sm:w-80 sm:h-60 bg-white/30 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] ring-1 ring-white/50">
             <img 
               src={clinicExteriorHero} 
               alt="Video Preview" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 group-hover:bg-transparent">
                <div className="w-16 h-16 bg-[#b0d64e]/95 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Play fill="currentColor" size={24} className="ml-1" />
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
