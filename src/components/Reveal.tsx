import React from 'react';
import { motion, Variants } from 'framer-motion';

// Courbe « expo out » : départ franc, arrivée très douce
export const easeOut = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'li' | 'p' | 'h2';
}

// Apparition au défilement : fondu + légère montée, une seule fois.
export function Reveal({ children, className, delay = 0, y = 28, as = 'div' }: RevealProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: easeOut }}>
      
      {children}
    </Tag>);

}

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } }
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } }
};

interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'ol';
}

// Conteneur dont les enfants <motion.* variants={revealItem}> apparaissent en cascade.
export function RevealGroup({ children, className, as = 'div' }: RevealGroupProps) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={group} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }}>
      {children}
    </Tag>);

}

// Titre révélé ligne par ligne, chaque ligne sortant d'un masque.
export function MaskedLines({ lines, className, delay = 0 }: {lines: React.ReactNode[];className?: string;delay?: number;}) {
  return (
    <span className={className}>
      {lines.map((line, i) =>
      <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
          className="block"
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1.1, delay: delay + i * 0.12, ease: easeOut }}>
          
            {line}
          </motion.span>
        </span>
      )}
    </span>);

}
