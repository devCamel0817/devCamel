import { motion } from 'framer-motion';

import type { GlassCardProps } from './types';

export default function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`glass glass-hover p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
