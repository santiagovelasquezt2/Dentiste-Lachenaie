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
  sizeScale = 1,
}: {
  image: AboutImage;
  alt: string;
  side: 'start' | 'end';
  /** `cover` fills the frame (no letter/pillarboxing); may crop. */
  objectFit?: 'contain' | 'cover';
  /** Linear scale for displayed width (e.g. 0.75 for 25% smaller). */
  sizeScale?: number;
}) => {
  const widthPx = Math.round(equalAreaWidthPx(image.intrinsicW, image.intrinsicH) * sizeScale);

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-black/[0.03] shadow-2xl ${side === 'start' ? 'self-start' : 'self-end'}`}
      style={{
        width: `min(${widthPx}px, ${88 * sizeScale}vw)`,
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
  sizeScale = 1,
}: {
  title: string;
  content: React.ReactNode;
  isLeft?: boolean;
  sizeScale?: number;
}) => {
  const words = title.split(' ');
  const firstWord = words[0];
  const restOfTitle = words.slice(1).join(' ');
  const compact = sizeScale < 1;

  return (
    <div
      className={`w-[90%] overflow-hidden rounded-3xl border-0 bg-white/90 shadow-xl ring-0 backdrop-blur-md md:w-[65%] ${compact ? 'p-6 md:p-9' : 'p-8 md:p-12'} ${isLeft ? 'self-start' : 'self-end'}`}
    >
      <div className={`text-text ${compact ? 'mb-[1.125rem]' : 'mb-6'}`}>
        <CheckSquare className={`stroke-[1.5] ${compact ? 'h-[1.875rem] w-[1.875rem]' : 'h-10 w-10'}`} />
      </div>
      <h3
        className={`font-display font-normal leading-[1.12] tracking-[-0.055em] text-text ${compact ? 'mb-[1.125rem] text-[clamp(1.3125rem,2.25vw,2.025rem)]' : 'mb-6 text-[clamp(1.75rem,3vw,2.7rem)]'}`}
      >
        {firstWord} <span className="font-bold text-accent">{restOfTitle}</span>
      </h3>
      <div
        className={
          compact
            ? 'space-y-3 font-body text-[clamp(0.75rem,0.9vw,0.84rem)] leading-[1.68] tracking-[-0.015em] text-text-light'
            : 'space-y-4 text-body-lg text-text-light'
        }
      >
        {content}
      </div>
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
    <article className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/92 p-6 shadow-[0_20px_60px_rgba(21,33,24,0.08)] ring-0 backdrop-blur-md">
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
  const desktopScale = 0.75;
  return (
    <section ref={containerRef} id="about" className="relative h-[262.5vh] scroll-mt-24 bg-[#E8EDE3]">
      <div className="sticky top-0 flex h-screen w-full justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <span className="select-none whitespace-nowrap font-display text-[clamp(3.375rem,8.25vw,7.5rem)] font-normal leading-[1.12] tracking-[-0.055em] [word-spacing:0.35em] text-black/10">
            {t.about.since}
          </span>
        </div>

        <motion.div
          style={{ y }}
          className="absolute top-full z-10 flex w-full max-w-3xl flex-col gap-18 px-[1.125rem] pb-[75vh] pt-[3vh]"
        >
          <AboutImageFrame
            image={images[0]}
            alt={t.about.images.patientSmile}
            side="start"
            sizeScale={desktopScale}
          />

          <TextBlock
            title={t.about.goal.title}
            content={<p>{formatText(t.about.goal.desc)}</p>}
            isLeft={false}
            sizeScale={desktopScale}
          />

          <AboutImageFrame
            image={images[1]}
            alt={t.about.images.dentalPractice}
            side="end"
            sizeScale={desktopScale}
          />
          <AboutImageFrame
            image={images[2]}
            alt={t.about.images.dentalCare}
            side="start"
            sizeScale={desktopScale}
          />

          <TextBlock
            title={t.about.commitment.title}
            content={
              <>
                <p>{formatText(t.about.commitment.desc1)}</p>
                <p>{formatText(t.about.commitment.desc2)}</p>
              </>
            }
            isLeft={true}
            sizeScale={desktopScale}
          />

          <AboutImageFrame image={images[3]} alt={t.about.images.clinic} side="end" sizeScale={desktopScale} />
          <AboutImageFrame
            image={images[4]}
            alt={t.about.images.treatment}
            side="start"
            objectFit="cover"
            sizeScale={desktopScale}
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
            sizeScale={desktopScale}
          />

          <AboutImageFrame image={images[5]} alt={t.about.images.dentalTeam} side="end" sizeScale={desktopScale} />
          <AboutImageFrame
            image={images[6]}
            alt={t.about.images.dentistWithPatient}
            side="start"
            sizeScale={desktopScale}
          />
        </motion.div>
      </div>
    </section>
  );
};
