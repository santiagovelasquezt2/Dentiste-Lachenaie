import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { SECTION_HEADING_CLASS } from '../lib/sectionHeading';

type FirstVisitStep = {
  text: string;
  download?: {
    href: string;
    label: string;
  };
};

const pdfIconSrc = `${import.meta.env.BASE_URL}assets/pdf-icon.svg`;

const SectionTitle = ({
  t,
  language,
}: {
  t: ReturnType<typeof useLanguage>['t'];
  language: ReturnType<typeof useLanguage>['language'];
}) => (
  <div className="max-w-3xl">
    <h2
      className={`${SECTION_HEADING_CLASS} mt-4 max-w-[10ch] text-[clamp(3rem,6vw,5rem)] text-[#17352D] ${
        language === 'fr' ? 'mx-auto text-center leading-[1.06]' : 'text-left'
      }`}
    >
      {t.firstVisit.title}
    </h2>
  </div>
);

const IntroCopy = ({ t }: { t: ReturnType<typeof useLanguage>['t'] }) => (
  <div className="max-w-[38rem] space-y-5 border-t border-[#17352D]/10 pt-6 sm:space-y-6 sm:pt-8">
    <p className="text-[1rem] leading-8 tracking-[-0.015em] text-[#17352D]/78 sm:text-[1.08rem]">
      {t.firstVisit.followup}
    </p>
    <p className="text-[1rem] leading-8 tracking-[-0.015em] text-[#17352D]/78 sm:text-[1.08rem]">
      {t.firstVisit.intro.prefix}
      <span className="font-semibold text-[#17352D] underline decoration-1 underline-offset-2 decoration-[#17352D]/22">
        {t.firstVisit.intro.emphasis}
      </span>
      {t.firstVisit.intro.suffix}
    </p>
  </div>
);

const StepRowBody = ({
  step,
  index,
}: {
  step: FirstVisitStep;
  index: number;
}) => {
  return (
    <div className="grid gap-3 py-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-5 sm:py-6">
      <span className="pt-0.5 font-nav text-[0.92rem] font-semibold tracking-[0.2em] text-brand-lime sm:text-[1rem]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0 space-y-3">
        <p className="text-[0.98rem] leading-7 tracking-[-0.012em] text-[#17352D]/84 sm:text-[1.04rem]">
          {step.text}
        </p>
      </div>
    </div>
  );
};

const InViewStepRow = ({
  step,
  index,
}: {
  step: FirstVisitStep;
  index: number;
}) => (
  <motion.li
    className="list-none border-b border-[#17352D]/10"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.42, margin: '0px 0px -8% 0px' }}
  >
    <motion.div
      variants={{
        hidden: { opacity: 0.01, y: 28 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1], delay: index * 0.03 }}
    >
      <StepRowBody step={step} index={index} />
    </motion.div>
  </motion.li>
);

const StaticStepRow = ({
  step,
  index,
}: {
  step: FirstVisitStep;
  index: number;
}) => (
  <li className="list-none border-b border-[#17352D]/10">
    <StepRowBody step={step} index={index} />
  </li>
);

const ProcedureTitle = ({ t }: { t: ReturnType<typeof useLanguage>['t'] }) => (
  <div className="max-w-[24rem]">
    <h3 className="font-display text-[2.3rem] font-normal leading-[1.02] tracking-[-0.06em] text-[#17352D] sm:text-[2.75rem] lg:text-[3.05rem]">
      <span className="text-[#17352D]/48">{t.firstVisit.procedure.prefix}</span>{' '}
      <span className="text-[#17352D]">{t.firstVisit.procedure.suffix}</span>
    </h3>
  </div>
);

const ProcedureSteps = ({
  t,
  mode,
}: {
  t: ReturnType<typeof useLanguage>['t'];
  mode: 'in-view' | 'static';
}) => (
  <ol id="first-visit-steps" className="scroll-mt-24 max-w-[36rem] border-t border-[#17352D]/10">
    {t.firstVisit.steps.map((step, index) =>
      mode === 'in-view' ? (
        <InViewStepRow key={step.text} step={step} index={index} />
      ) : (
        <StaticStepRow key={step.text} step={step} index={index} />
      ),
    )}
  </ol>
);

const ProcedureColumn = ({
  t,
  prefersReducedMotion,
}: {
  t: ReturnType<typeof useLanguage>['t'];
  prefersReducedMotion: boolean | null;
}) => (
  <div className="overflow-x-clip lg:justify-self-end lg:pt-6 xl:pt-8">
    <div className="max-w-[36rem]">
      <ProcedureTitle t={t} />
      <div className="mt-6 sm:mt-7">
        <ProcedureSteps t={t} mode={prefersReducedMotion ? 'static' : 'in-view'} />
      </div>
    </div>
  </div>
);

export const FirstVisitSection: React.FC = () => {
  const { t, language } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const downloadStep = t.firstVisit.steps.find((step) => step.download);
  const downloadHref =
    downloadStep?.download == null
      ? null
      : downloadStep.download.href.startsWith('http')
        ? downloadStep.download.href
        : `${import.meta.env.BASE_URL}${downloadStep.download.href.replace(/^\//, '')}`;

  return (
    <section id="first-visit" className="relative scroll-mt-24 overflow-x-clip bg-bg py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(244,244,244,0.9),rgba(255,255,255,0))]" />
        <div className="absolute left-1/2 top-20 h-72 w-[min(92vw,72rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(209,232,209,0.5),rgba(209,232,209,0.14)_42%,transparent_74%)] blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="relative">
          <div
            className="pointer-events-none absolute left-0 top-5 h-px w-full bg-[linear-gradient(90deg,rgba(176,214,78,0.28),transparent_42%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(176,214,78,0.1),transparent_72%)] blur-2xl"
            aria-hidden
          />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12 xl:gap-16">
            <div className="space-y-8">
              <SectionTitle t={t} language={language} />
              <IntroCopy t={t} />
            </div>

            <ProcedureColumn t={t} prefersReducedMotion={prefersReducedMotion} />
          </div>

          {downloadStep?.download && downloadHref ? (
            <div className="mt-10 flex justify-center lg:mt-12">
              <a
                href={downloadHref}
                download
                aria-label={downloadStep.download.label}
                className="inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-brand-lime px-6 py-3.5 text-[0.95rem] font-semibold tracking-[-0.01em] text-[#17352D] shadow-[0_14px_28px_rgba(176,214,78,0.24)] transition-[transform,background-color,box-shadow,color] duration-200 hover:scale-[1.02] hover:bg-white hover:shadow-[0_18px_32px_rgba(23,53,45,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/45 sm:w-auto"
              >
                <img src={pdfIconSrc} alt="" className="h-5 w-5 select-none" />
                <span>{t.firstVisit.downloadCta}</span>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
