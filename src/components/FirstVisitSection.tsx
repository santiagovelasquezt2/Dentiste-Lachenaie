import React, { useLayoutEffect, useRef } from 'react';
import {
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

type FirstVisitStep = {
  text: string;
  download?: {
    href: string;
    label: string;
  };
};

const pdfIconSrc = `${import.meta.env.BASE_URL}assets/pdf-icon.svg`;

const stepCardShell =
  'rounded-[1.25rem] bg-white px-5 py-5 shadow-[0_24px_70px_rgba(2,33,24,0.1)] ring-1 ring-black/5 sm:px-7 sm:py-6';

const StepCardBody = ({ step, index }: { step: FirstVisitStep; index: number }) => (
  <div className="flex items-start gap-3 sm:gap-4">
    <span className="min-w-[2rem] shrink-0 text-right text-[1.35rem] font-semibold leading-none text-brand-lime sm:min-w-[2.4rem] sm:text-[1.6rem]">
      {index + 1}.
    </span>
    <div className="flex-1 text-[0.98rem] leading-7 text-[#17352D]/85 sm:text-[1.06rem]">
      <span>{step.text}</span>
      {step.download ? (
        <a
          href={step.download.href}
          download
          aria-label={step.download.label}
          className="ml-2 inline-flex align-middle rounded-sm border border-[#17352D]/15 bg-white p-0.5 shadow-sm transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17352D]/25"
        >
          <img src={pdfIconSrc} alt="" className="h-7 w-7 select-none" />
        </a>
      ) : null}
    </div>
  </div>
);

const AnimatedStepCard = ({
  step,
  index,
  scrollYProgress,
}: {
  step: FirstVisitStep;
  index: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const stagger = 0.12;
  const revealLength = 0.22;
  const start = 0.08 + index * stagger;
  const end = start + revealLength;
  const cardOffset = typeof window !== 'undefined' ? Math.max(window.innerWidth * 0.92, 960) : 1200;
  const reveal = useTransform(scrollYProgress, [start, end], [0, 1], { clamp: true });
  const x = useTransform(reveal, [0, 1], [cardOffset, 0]);
  const previousRevealRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (index !== 0) return;
    fetch('http://127.0.0.1:7573/ingest/20ff4847-cd1d-41af-aa0a-6e2f30cd5f25', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b99f22' },
      body: JSON.stringify({
        sessionId: 'b99f22',
        runId: 'run2',
        hypothesisId: 'H1',
        location: 'FirstVisitSection.tsx:AnimatedStepCard:mount',
        message: 'Primary step mounted with reversible horizontal offset',
        data: { index, start, end, cardOffset, initialProgress: scrollYProgress.get() },
        timestamp: Date.now(),
        id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      }),
    }).catch(() => {});
  }, [cardOffset, end, index, scrollYProgress, start]);

  useMotionValueEvent(reveal, 'change', (latest) => {
    if (index !== 0) return;
    const previousReveal = previousRevealRef.current;
    fetch('http://127.0.0.1:7573/ingest/20ff4847-cd1d-41af-aa0a-6e2f30cd5f25', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b99f22' },
      body: JSON.stringify({
        sessionId: 'b99f22',
        runId: 'run2',
        hypothesisId: 'H1',
        location: 'FirstVisitSection.tsx:AnimatedStepCard:progress',
        message: 'Primary step reveal updated',
        data: {
          index,
          reveal: latest,
          x: x.get(),
          direction: previousReveal != null && latest < previousReveal ? 'up' : 'down',
          cardOffset,
        },
        timestamp: Date.now(),
        id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      }),
    }).catch(() => {});
    previousRevealRef.current = latest;
  });

  return (
    <motion.li style={{ x, willChange: 'transform' }} className="list-none">
      <div className={stepCardShell}>
        <StepCardBody step={step} index={index} />
      </div>
    </motion.li>
  );
};

const InViewStepCard = ({ step, index }: { step: FirstVisitStep; index: number }) => (
  <motion.li
    className="list-none"
    initial={{ opacity: 0, x: 24, y: 10, scale: 0.985 }}
    whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.35, margin: '0px 0px -12% 0px' }}
    transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 0.9 }}
  >
    <div className={stepCardShell}>
      <StepCardBody step={step} index={index} />
    </div>
  </motion.li>
);

const StaticStepCard = ({ step, index }: { step: FirstVisitStep; index: number }) => (
  <li className="list-none">
    <div className={stepCardShell}>
      <StepCardBody step={step} index={index} />
    </div>
  </li>
);

export const FirstVisitSection: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    fetch('http://127.0.0.1:7573/ingest/20ff4847-cd1d-41af-aa0a-6e2f30cd5f25', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b99f22' },
      body: JSON.stringify({
        sessionId: 'b99f22',
        runId: 'run2',
        hypothesisId: 'H5',
        location: 'FirstVisitSection.tsx:branch-selection',
        message: 'Selected first-visit animation branch',
        data: {
          branch: isMobile ? 'mobile' : 'desktop',
          prefersReducedMotion,
        },
        timestamp: Date.now(),
        id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      }),
    }).catch(() => {});
  }, [isMobile, prefersReducedMotion]);

  if (isMobile) {
    return <FirstVisitSectionMobile t={t} />;
  }

  return <FirstVisitSectionDesktop t={t} />;
};

const IntroBlock = ({ t }: { t: ReturnType<typeof useLanguage>['t'] }) => {
  return (
    <div className="mx-auto max-w-5xl text-text-light">
      <p className="mb-8 text-left text-[0.98rem] italic uppercase tracking-[0.14em] leading-8 text-[#17352D]/65 sm:text-[1.05rem]">
        {t.firstVisit.eyebrow}
      </p>
      <p className="mb-8 text-left text-[1.02rem] leading-8 sm:text-[1.12rem]">
        {t.firstVisit.intro.prefix}
        <span className="font-semibold underline decoration-1 underline-offset-2 decoration-[#17352D]/35">
          {t.firstVisit.intro.emphasis}
        </span>
        {t.firstVisit.intro.suffix}
      </p>
      <p className="text-left text-[1.02rem] leading-8 sm:text-[1.12rem]">
        {t.firstVisit.followup}
      </p>
    </div>
  );
};

const ProcedureTitle = ({ t }: { t: ReturnType<typeof useLanguage>['t'] }) => {
  return (
    <div className="text-center">
      <h2 className="text-[2.3rem] font-light tracking-tight text-[#17352D] sm:text-[2.9rem] lg:text-[3.35rem]">
        <span className="text-[#17352D]/55">{t.firstVisit.procedure.prefix}</span>{' '}
        <span className="font-normal text-[#17352D]">{t.firstVisit.procedure.suffix}</span>
      </h2>
    </div>
  );
};

const ProcedureSteps = ({
  t,
  mode,
  scrollYProgress,
}: {
  t: ReturnType<typeof useLanguage>['t'];
  mode: 'scroll-linked' | 'in-view' | 'static';
  scrollYProgress?: MotionValue<number>;
}) => {
  const fallbackProgress = useMotionValue(0);
  const springProgress = useSpring(scrollYProgress ?? fallbackProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.9,
    restDelta: 0.001,
  });

  return (
    <ol id="first-visit-steps" className="scroll-mt-24 flex flex-col gap-4 sm:gap-5">
      {t.firstVisit.steps.map((step, i) => {
        if (mode === 'scroll-linked' && scrollYProgress) {
          return <AnimatedStepCard key={step.text} step={step} index={i} scrollYProgress={springProgress} />;
        }
        if (mode === 'in-view') {
          return <InViewStepCard key={step.text} step={step} index={i} />;
        }
        return <StaticStepCard key={step.text} step={step} index={i} />;
      })}
    </ol>
  );
};

const FirstVisitSectionMobile = ({ t }: { t: ReturnType<typeof useLanguage>['t'] }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="first-visit" className="relative scroll-mt-24 overflow-hidden bg-[#E8EDE3] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_55%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <IntroBlock t={t} />
          <div className="mb-8 sm:mb-10">
            <ProcedureTitle t={t} />
          </div>
          <ProcedureSteps t={t} mode={prefersReducedMotion ? 'static' : 'in-view'} />
        </div>
      </div>
    </section>
  );
};

const FirstVisitSectionDesktop = ({ t }: { t: ReturnType<typeof useLanguage>['t'] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section ref={containerRef} id="first-visit" className="relative h-[300vh] scroll-mt-24 bg-[#E8EDE3]">
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5),transparent_52%)]" />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <IntroBlock t={t} />
            <div className="mb-8 sm:mb-10">
              <ProcedureTitle t={t} />
            </div>
            <ProcedureSteps
              t={t}
              mode={prefersReducedMotion ? 'static' : 'scroll-linked'}
              scrollYProgress={prefersReducedMotion ? undefined : scrollYProgress}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
