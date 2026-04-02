import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { CheckSquare } from 'lucide-react';

const images = [
  {
    src: "https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=2069&auto=format&fit=crop",
    alt: "Reception",
    aspect: "aspect-[3/4]"
  },
  {
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
    alt: "Waiting Room",
    aspect: "aspect-square"
  },
  {
    src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070&auto=format&fit=crop",
    alt: "Treatment Room",
    aspect: "aspect-[4/3]"
  },
  {
    src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop",
    alt: "Sterilization",
    aspect: "aspect-[3/4]"
  },
  {
    src: "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?q=80&w=2070&auto=format&fit=crop",
    alt: "Clinic",
    aspect: "aspect-square"
  },
  {
    src: "https://images.unsplash.com/photo-1504280658469-166299298811?q=80&w=2070&auto=format&fit=crop",
    alt: "Clinic Details",
    aspect: "aspect-[4/3]"
  },
  {
    src: "https://images.unsplash.com/photo-1598256989800-fea5ce5146f2?q=80&w=2070&auto=format&fit=crop",
    alt: "Dentist Working",
    aspect: "aspect-[3/4]"
  }
];

// Helper to render bold text from markdown-style **bold** strings
const formatText = (text: string) => {
  const parts = text.split('**');
  return parts.map((part, i) => 
    i % 2 === 1 ? <strong key={i} className="font-bold text-text">{part}</strong> : part
  );
};

const TextBlock = ({ title, content, isLeft }: { title: string, content: React.ReactNode, isLeft?: boolean }) => {
  const words = title.split(' ');
  const firstWord = words[0];
  const restOfTitle = words.slice(1).join(' ');

  return (
    <div className={`w-[90%] md:w-[65%] ${isLeft ? 'self-start' : 'self-end'} bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl`}>
      <div className="mb-6 text-text">
        <CheckSquare className="w-10 h-10 stroke-[1.5]" />
      </div>
      <h3 className="text-3xl md:text-4xl font-heading font-normal text-text mb-6">
        {firstWord} <span className="text-accent font-bold">{restOfTitle}</span>
      </h3>
      <div className="space-y-4 text-text-light leading-relaxed text-lg">
        {content}
      </div>
    </div>
  );
};

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // By using 0% to -100%, we move the container up by exactly its own height.
  // We start it at top-full (bottom of the screen) and add pb-[100vh] so the 
  // content perfectly clears the top of the screen at the end of the scroll.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <section ref={containerRef} id="about" className="relative h-[350vh] bg-[#E8EDE3]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex justify-center">
        
        {/* Background "SINCE 2000" Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-[11vw] font-heading font-bold text-black/10 whitespace-nowrap select-none">
            {t.about.since}
          </span>
        </div>

        <motion.div 
          style={{ y }}
          className="absolute top-full w-full max-w-5xl px-6 flex flex-col gap-24 pt-[10vh] pb-[100vh] z-10"
        >
          {/* Image 1 */}
          <div className={`w-[45%] md:w-[35%] ${images[0].aspect} rounded-2xl overflow-hidden shadow-2xl self-start`}>
            <img src={images[0].src} alt={images[0].alt} className="w-full h-full object-cover" />
          </div>

          {/* Text Block 1: Goal */}
          <TextBlock 
            title={t.about.goal.title} 
            content={<p>{formatText(t.about.goal.desc)}</p>} 
            isLeft={false} 
          />

          {/* Image 2 & 3 */}
          <div className={`w-[45%] md:w-[35%] ${images[1].aspect} rounded-2xl overflow-hidden shadow-2xl self-end`}>
            <img src={images[1].src} alt={images[1].alt} className="w-full h-full object-cover" />
          </div>
          <div className={`w-[45%] md:w-[35%] ${images[2].aspect} rounded-2xl overflow-hidden shadow-2xl self-start`}>
            <img src={images[2].src} alt={images[2].alt} className="w-full h-full object-cover" />
          </div>

          {/* Text Block 2: Commitment */}
          <TextBlock 
            title={t.about.commitment.title} 
            content={
              <>
                <p>{formatText(t.about.commitment.desc1)}</p>
                <p>{formatText(t.about.commitment.desc2)}</p>
              </>
            } 
            isLeft={true} 
          />

          {/* Image 4 & 5 */}
          <div className={`w-[45%] md:w-[35%] ${images[3].aspect} rounded-2xl overflow-hidden shadow-2xl self-end`}>
            <img src={images[3].src} alt={images[3].alt} className="w-full h-full object-cover" />
          </div>
          <div className={`w-[45%] md:w-[35%] ${images[4].aspect} rounded-2xl overflow-hidden shadow-2xl self-start`}>
            <img src={images[4].src} alt={images[4].alt} className="w-full h-full object-cover" />
          </div>

          {/* Text Block 3: Promise */}
          <TextBlock 
            title={t.about.promise.title} 
            content={
              <>
                <p>{formatText(t.about.promise.desc1)}</p>
                <p>{formatText(t.about.promise.desc2)}</p>
              </>
            } 
            isLeft={false} 
          />

          {/* Image 6 & 7 */}
          <div className={`w-[45%] md:w-[35%] ${images[5].aspect} rounded-2xl overflow-hidden shadow-2xl self-end`}>
            <img src={images[5].src} alt={images[5].alt} className="w-full h-full object-cover" />
          </div>
          <div className={`w-[45%] md:w-[35%] ${images[6].aspect} rounded-2xl overflow-hidden shadow-2xl self-start`}>
            <img src={images[6].src} alt={images[6].alt} className="w-full h-full object-cover" />
          </div>

        </motion.div>
      </div>
    </section>
  );
};
