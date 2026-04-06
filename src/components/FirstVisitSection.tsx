import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './Button';
import { motion, useScroll, useTransform, MotionValue, useMotionValueEvent } from 'framer-motion';
import { HoursContourPattern } from './HoursContourPattern';

const StepCard = ({ 
  step, 
  index, 
  scrollYProgress 
}: { 
  step: string; 
  index: number; 
  scrollYProgress: MotionValue<number>;
}) => {
  // Calculate staggered scroll ranges for each step
  // 6 steps total, each takes 15% of the scroll progress
  const start = index * 0.15;
  const end = start + 0.15;
  
  // Map the scroll progress to x position
  const x = useTransform(scrollYProgress, [start, end], ["50vw", "0vw"]);

  // #region agent log
  useMotionValueEvent(x, 'change', (latest) => {
    if (index <= 1) {
      fetch('http://127.0.0.1:7516/ingest/8d447b25-2b2c-4cbb-b15f-8fbee55e32bb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '40b3fd' },
        body: JSON.stringify({ sessionId: '40b3fd', hypothesisId: 'H-A', location: 'FirstVisitSection.tsx:StepCard:x', message: 'x changed', data: { index, x: latest, progress: scrollYProgress.get(), start, end }, timestamp: Date.now() })
      }).catch(() => {});
    }
  });
  // #endregion

  return (
    <motion.div 
      style={{ x }}
      className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-6 group hover:shadow-md transition-shadow duration-300"
    >
      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
        <span className="text-card-title text-accent group-hover:text-bg-dark">
          {index + 1}
        </span>
      </div>
      <p className="text-body-lg pt-2 text-text">
        {step}
      </p>
    </motion.div>
  );
};

export const FirstVisitSection: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // #region agent log
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    fetch('http://127.0.0.1:7516/ingest/8d447b25-2b2c-4cbb-b15f-8fbee55e32bb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '40b3fd' },
      body: JSON.stringify({ sessionId: '40b3fd', hypothesisId: 'H-B+H-C', location: 'FirstVisitSection.tsx:scrollYProgress', message: 'progress change', data: { progress: latest }, timestamp: Date.now() })
    }).catch(() => {});
  });
  // #endregion

  return (
    <section ref={containerRef} id="first-visit" className="relative h-[300vh] bg-[#B0D64E]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.38),transparent_44%),linear-gradient(135deg,rgba(196,228,109,0.98),rgba(176,214,78,0.98)_42%,rgba(140,176,55,1))]" />
          <HoursContourPattern className="hours-pattern hours-pattern-slow absolute inset-[-12%] h-[124%] w-[124%] stroke-[#17352D]/10 stroke-[2] fill-none" />
          <HoursContourPattern className="hours-pattern hours-pattern-fast absolute inset-[-18%] h-[136%] w-[136%] stroke-white/12 stroke-[1.5] fill-none" />
        </div>
        <div className="flex h-full w-full items-center overflow-hidden">
          <div className="container relative z-10 mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Column - Static */}
            <div className="text-[#17352D]">
              <h2 className="text-section-title font-bold text-[#17352D] mb-8">
                {t.firstVisit.title}
              </h2>
              <p className="text-lead mb-12 text-[#17352D]/78">
                {t.firstVisit.intro}
              </p>
              
              <div className="bg-white/95 p-8 rounded-3xl shadow-lg border-l-4 border-accent mb-12 backdrop-blur-sm">
                <p className="text-body-lg text-text italic">
                  {t.firstVisit.cancellation}
                </p>
              </div>

              <Button
                size="lg"
                className="bg-[#17352D] text-white hover:bg-[#0F241E]"
                onClick={() => window.location.href = '#appointment'}
              >
                {t.firstVisit.button}
              </Button>
            </div>

            {/* Right Column - Animated Steps */}
            <div className="grid gap-6 relative">
              {t.firstVisit.steps.map((step, i) => (
                <StepCard 
                  key={i} 
                  step={step} 
                  index={i} 
                  scrollYProgress={scrollYProgress} 
                />
              ))}
            </div>

            </div>
          </div>
        </div>
      </div>
      {/* Nav target: scroll position where sticky block hits end of its track (all steps revealed).
          Must not sit at section bottom — hash scroll aligns target top to viewport, which would skip past this block. */}
      <div
        id="first-visit-steps"
        className="pointer-events-none absolute left-0 h-px w-full"
        style={{ top: 'calc(100% - 100vh)' }}
        aria-hidden
      />
    </section>
  );
};
