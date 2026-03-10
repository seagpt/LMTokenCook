import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function Tooltip({ children, content, side = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: side === 'top' ? 10 : 0, x: side === 'right' ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              "absolute z-50 p-3 text-xs leading-relaxed text-white/90 bg-neutral-900 border border-white/10 rounded-xl shadow-xl backdrop-blur-md w-64 pointer-events-none",
              side === 'top' && "bottom-full mb-2",
              side === 'right' && "left-full ml-2",
              side === 'left' && "right-full mr-2",
              side === 'bottom' && "top-full mt-2"
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
