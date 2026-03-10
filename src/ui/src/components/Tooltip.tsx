import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    children: ReactNode;
    content: string | ReactNode;
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
                        className={`absolute z-50 p-3 text-xs leading-relaxed text-white/90 bg-neutral-900 border border-white/10 rounded-xl shadow-xl backdrop-blur-md w-64 pointer-events-none
              ${side === 'top' ? 'bottom-full mb-2' : ''}
              ${side === 'bottom' ? 'top-full mt-2' : ''}
              ${side === 'right' ? 'left-full ml-2' : ''}
              ${side === 'left' ? 'right-full mr-2' : ''}
            `}
                    >
                        <div className="absolute inset-0 bg-amber-500/5 rounded-xl -z-10" />
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
