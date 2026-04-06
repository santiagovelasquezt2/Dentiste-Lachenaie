import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { CheckSquare } from 'lucide-react';
import about01 from '@/DentalContent/Images/About/about-01-best-smile.png';
import about02 from '@/DentalContent/Images/About/about-02.png';
import about03 from '@/DentalContent/Images/About/about-03.png';
import about04 from '@/DentalContent/Images/About/about-04.png';
import about05 from '@/DentalContent/Images/About/about-05.png';
import about06 from '@/DentalContent/Images/About/about-06.png';
import about07 from '@/DentalContent/Images/About/about-07-dentist-with-patient.jpg';

/** CSS px² — display width/height scale so (w×h) stays ~constant while aspect ratios stay true to each file. */
const TARGET_DISPLAY_AREA_PX2 = 238_473;

type AboutImage = {
  src: string;
  intrinsicW: number;
  intrinsicH: number;
};

const images: AboutImage[] = [
  { src: about01, intrinsicW: 1024, intrinsicH: 683 },
  { src: about02, intrinsicW: 425, intrinsicH: 650 },
  { src: about03, intrinsicW: 648, intrinsicH: 926 },
  { src: about04, intrinsicW: 743, intrinsicH: 926 },
  { src: about05, intrinsicW: 891, intrinsicH: 926 },
  { src: about06, intrinsicW: 736, intrinsicH: 926 },
  { src: about07, intrinsicW: 2048, intrinsicH: 1365 }
];

function equalAreaWidthPx(w: number, h: number): number {
  return Math.round(Math.sqrt(TARGET_DISPLAY_AREA_PX2 * (w / h)));
}

const AboutImageFrame = ({
  image,
  alt,
  side
}: {
  image: AboutImage;
  alt: string;
  side: "start" | "end";
}) => {
  const widthPx = equalAreaWidthPx(image.intrinsicW, image.intrinsicH);
  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-2xl bg-black/[0.03] ${side === "start" ? "self-start" : "self-end"}`}
      style={{
        width: `min(${widthPx}px, 88vw)`,
        aspectRatio: `${image.intrinsicW} / ${image.intrinsicH}`
      }}
    >
      <img
        src={image.src}
        alt={alt}
        width={image.intrinsicW}
        height={image.intrinsicH}
        className="h-full w-full object-contain"
        decoding="async"
      />
    </div>
  );
};

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
      <h3 className="text-title mb-6 text-text">
        {firstWord} <span className="text-accent font-bold">{restOfTitle}</span>
      </h3>
      <div className="text-body-lg space-y-4 text-text-light">
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
          <span className="font-heading whitespace-nowrap select-none text-[clamp(4.5rem,11vw,10rem)] font-semibold tracking-[-0.07em] text-black/10">
            {t.about.since}
          </span>
        </div>

        <motion.div 
          style={{ y }}
          className="absolute top-full w-full max-w-5xl px-6 flex flex-col gap-24 pt-[10vh] pb-[100vh] z-10"
        >
          {/* Image 1 */}
          <AboutImageFrame image={images[0]} alt={t.about.images.patientSmile} side="start" />

          {/* Text Block 1: Goal */}
          <TextBlock 
            title={t.about.goal.title} 
            content={<p>{formatText(t.about.goal.desc)}</p>} 
            isLeft={false} 
          />

          {/* Image 2 & 3 */}
          <AboutImageFrame image={images[1]} alt={t.about.images.dentalPractice} side="end" />
          <AboutImageFrame image={images[2]} alt={t.about.images.dentalCare} side="start" />

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
          <AboutImageFrame image={images[3]} alt={t.about.images.clinic} side="end" />
          <AboutImageFrame image={images[4]} alt={t.about.images.treatment} side="start" />

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
          <AboutImageFrame image={images[5]} alt={t.about.images.dentalTeam} side="end" />
          <AboutImageFrame image={images[6]} alt={t.about.images.dentistWithPatient} side="start" />

        </motion.div>
      </div>
    </section>
  );
};
