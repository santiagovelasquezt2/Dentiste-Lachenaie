import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './Button';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

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

  return (
    <motion.div 
      style={{ x }}
      className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-6 group hover:shadow-md transition-shadow duration-300"
    >
      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
        <span className="text-accent font-bold text-lg group-hover:text-bg-dark">
          {index + 1}
        </span>
      </div>
      <p className="text-lg text-text font-medium pt-2">
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

  return (
    <section ref={containerRef} id="first-visit" className="bg-bg-alt relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Column - Static */}
            <div>
              <h2 className="text-section-title font-bold text-text mb-8">
                {t.firstVisit.title}
              </h2>
              <p className="text-xl text-text-light mb-12 leading-relaxed">
                {t.firstVisit.intro}
              </p>
              
              <div className="bg-white p-8 rounded-3xl shadow-lg border-l-4 border-accent mb-12">
                <p className="text-lg font-medium text-text italic">
                  {t.firstVisit.cancellation}
                </p>
              </div>

              <Button size="lg" onClick={() => window.location.href = '#appointment'}>
                Prendre rendez-vous
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
    </section>
  );
};

