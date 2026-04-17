import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import about01 from '@/DentalContent/Images/About/about-01-best-smile.png';
import about02 from '@/DentalContent/Images/About/about-02.png';
import about03 from '@/DentalContent/Images/About/about-03.png';
import about04 from '@/DentalContent/Images/About/about-04.jpg';
import about05 from '@/DentalContent/Images/About/about-05.png';
import about06 from '@/DentalContent/Images/About/about-06.png';
import about07 from '@/DentalContent/Images/About/about-07-dentist-with-patient.png';

const TARGET_DISPLAY_AREA_PX2 = 238_473;

type AboutImage = {
  src: string;
  intrinsicW: number;
  intrinsicH: number;
};

const images: AboutImage[] = [
  { src: about01, intrinsicW: 975, intrinsicH: 1300 },
  { src: about02, intrinsicW: 425, intrinsicH: 650 },
  { src: about03, intrinsicW: 648, intrinsicH: 926 },
  { src: about04, intrinsicW: 2316, intrinsicH: 3088 },
  { src: about05, intrinsicW: 891, intrinsicH: 926 },
  { src: about06, intrinsicW: 736, intrinsicH: 926 },
  { src: about07, intrinsicW: 971, intrinsicH: 1300 },
];

function equalAreaWidthPx(w: number, h: number): number {
  return Math.round(Math.sqrt(TARGET_DISPLAY_AREA_PX2 * (w / h)));
}

const AboutImageFrame = ({
  image,
  alt,
  side,
  objectFit = 'contain',
}: {
  image: AboutImage;
  alt: string;
  side: 'start' | 'end';
  /** `cover` fills the frame (no letter/pillarboxing); may crop. */
  objectFit?: 'contain' | 'cover';
}) => {
  const widthPx = equalAreaWidthPx(image.intrinsicW, image.intrinsicH);

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-black/[0.03] shadow-2xl ${side === 'start' ? 'self-start' : 'self-end'}`}
      style={{
        width: `min(${widthPx}px, 88vw)`,
        aspectRatio: `${image.intrinsicW} / ${image.intrinsicH}`,
      }}
    >
      <img
        src={image.src}
        alt={alt}
        width={image.intrinsicW}
        height={image.intrinsicH}
        className={
          objectFit === 'cover'
            ? 'h-full w-full object-cover object-center'
            : 'h-full w-full object-contain'
        }
        decoding="async"
      />
    </div>
  );
};

const formatText = (text: string) => {
  const parts = text.split('**');

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-text">
        {part}
      </strong>
    ) : (
      part
    )
  );
};

const TextBlock = ({
  title,
  content,
  isLeft,
}: {
  title: string;
  content: React.ReactNode;
  isLeft?: boolean;
}) => {
  const words = title.split(' ');
  const firstWord = words[0];
  const restOfTitle = words.slice(1).join(' ');

  return (
    <div
      className={`w-[90%] bg-white/90 p-8 shadow-xl backdrop-blur-md md:w-[65%] md:p-12 ${isLeft ? 'self-start' : 'self-end'} rounded-3xl`}
    >
      <div className="mb-6 text-text">
        <CheckSquare className="h-10 w-10 stroke-[1.5]" />
      </div>
      <h3 className="mb-6 font-display text-[clamp(1.75rem,3vw,2.7rem)] font-normal leading-[1.12] tracking-[-0.055em] text-text">
        {firstWord} <span className="font-bold text-accent">{restOfTitle}</span>
      </h3>
      <div className="space-y-4 text-body-lg text-text-light">{content}</div>
    </div>
  );
};

const MobileTextBlock = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => {
  const words = title.split(' ');
  const firstWord = words[0];
  const restOfTitle = words.slice(1).join(' ');

  return (
    <article className="rounded-[2rem] border border-black/5 bg-white/92 p-6 shadow-[0_20px_60px_rgba(21,33,24,0.08)] backdrop-blur-md">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff4e5] text-text">
        <CheckSquare className="h-6 w-6 stroke-[1.75]" />
      </div>
      <h3 className="mb-4 font-display text-3xl font-normal leading-[1.12] tracking-[-0.055em] text-text">
        {firstWord} <span className="font-bold text-accent">{restOfTitle}</span>
      </h3>
      <div className="space-y-4 text-base leading-relaxed text-text-light">{content}</div>
    </article>
  );
};

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  if (isMobile) {
    return <AboutSectionMobile t={t} />;
  }

  return <AboutSectionDesktop t={t} />;
};

const AboutSectionMobile = ({ t }: { t: ReturnType<typeof useLanguage>['t'] }) => {
  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden bg-[#E8EDE3] py-20">
      <div className="absolute inset-x-0 top-12 flex justify-center px-4" aria-hidden>
        <span className="select-none whitespace-nowrap font-display text-[3.6rem] font-normal leading-[1.12] tracking-[-0.055em] [word-spacing:0.35em] text-black/8">
          {t.about.since}
        </span>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-xl space-y-6">
          <AboutImageFrame image={images[0]} alt={t.about.images.patientSmile} side="start" />

          <MobileTextBlock
            title={t.about.goal.title}
            content={<p>{formatText(t.about.goal.desc)}</p>}
          />

          <AboutImageFrame image={images[2]} alt={t.about.images.dentalCare} side="end" />

          <MobileTextBlock
            title={t.about.commitment.title}
            content={
              <>
                <p>{formatText(t.about.commitment.desc1)}</p>
                <p>{formatText(t.about.commitment.desc2)}</p>
              </>
            }
          />

          <AboutImageFrame image={images[6]} alt={t.about.images.dentistWithPatient} side="start" />

          <MobileTextBlock
            title={t.about.promise.title}
            content={
              <>
                <p>{formatText(t.about.promise.desc1)}</p>
                <p>{formatText(t.about.promise.desc2)}</p>
              </>
            }
          />
        </div>
      </div>
    </section>
  );
};

const AboutSectionDesktop = ({ t }: { t: ReturnType<typeof useLanguage>['t'] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);
  return (
    <section ref={containerRef} id="about" className="relative h-[350vh] scroll-mt-24 bg-[#E8EDE3]">
      <div className="sticky top-0 flex h-screen w-full justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <span className="select-none whitespace-nowrap font-display text-[clamp(4.5rem,11vw,10rem)] font-normal leading-[1.12] tracking-[-0.055em] [word-spacing:0.35em] text-black/10">
            {t.about.since}
          </span>
        </div>

        <motion.div
          style={{ y }}
          className="absolute top-full z-10 flex w-full max-w-5xl flex-col gap-24 px-6 pb-[100vh] pt-[10vh]"
        >
          <AboutImageFrame image={images[0]} alt={t.about.images.patientSmile} side="start" />

          <TextBlock
            title={t.about.goal.title}
            content={<p>{formatText(t.about.goal.desc)}</p>}
            isLeft={false}
          />

          <AboutImageFrame image={images[1]} alt={t.about.images.dentalPractice} side="end" />
          <AboutImageFrame image={images[2]} alt={t.about.images.dentalCare} side="start" />

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

          <AboutImageFrame image={images[3]} alt={t.about.images.clinic} side="end" />
          <AboutImageFrame
            image={images[4]}
            alt={t.about.images.treatment}
            side="start"
            objectFit="cover"
          />

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

          <AboutImageFrame image={images[5]} alt={t.about.images.dentalTeam} side="end" />
          <AboutImageFrame image={images[6]} alt={t.about.images.dentistWithPatient} side="start" />
        </motion.div>
      </div>
    </section>
  );
};
