import React from 'react';
import { motion } from 'framer-motion';
import { easeOut, MaskedLines } from './Reveal';

interface PageHeaderProps {
  title: string;
  description?: string;
  kicker?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, kicker, children }: PageHeaderProps) {
  return (
    <section className="grain bg-fecam-black text-fecam-paper">
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        {kicker &&
        <motion.p
          className="font-serif text-xl italic text-fecam-orange"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: easeOut }}>
          
            {kicker}
          </motion.p>
        }
        <h1 className="mt-2 max-w-4xl font-poster text-6xl uppercase leading-[0.95] lg:text-8xl">
          <MaskedLines lines={[title]} delay={0.05} />
        </h1>
        {description &&
        <motion.p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-fecam-paper/70"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: easeOut }}>
          
            {description}
          </motion.p>
        }
        {children}
      </div>
    </section>);

}
