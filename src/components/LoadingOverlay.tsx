import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass } from 'lucide-react';
import { INDIAN_CULTURAL_FACTS } from '../utils';

interface LoadingOverlayProps {
  isVisible: boolean;
  destinationName: string | null;
}

/**
 * LoadingOverlay Component
 * Displays a full-screen loading state with random cultural facts.
 * Wrapped in React.memo to prevent unnecessary re-renders.
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = React.memo(({ isVisible, destinationName }) => {
  const [fact, setFact] = useState('');

  useEffect(() => {
    if (isVisible) {
      // Pick a random fact when it opens
      const randomFact = INDIAN_CULTURAL_FACTS[Math.floor(Math.random() * INDIAN_CULTURAL_FACTS.length)];
      setFact(randomFact);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center"
        >
          {/* Dark blurred background overlay */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative z-10 flex flex-col items-center max-w-lg"
          >
            {/* Spinning Compass Logo */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-saffron to-crimson shadow-[0_0_40px_rgba(245,165,67,0.4)] mb-8 animate-spin-slow">
              <Compass size={40} className="text-white" />
            </div>

            <h2 className="font-display text-3xl md:text-4xl text-white mb-3 text-shadow-hero">
              {destinationName ? `Curating ${destinationName}` : 'Discovering Bharat'}...
            </h2>
            
            <p className="font-devanagari text-yellow-400 font-bold drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] text-xl mb-8 animate-pulse">
              कृपया प्रतीक्षा करें (Please wait)
            </p>

            <div className="glass-panel p-6 rounded-2xl w-full">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">
                Did you know?
              </h3>
              <p className="font-body text-white/90 leading-relaxed text-lg italic">
                "{fact}"
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';
export default LoadingOverlay;
