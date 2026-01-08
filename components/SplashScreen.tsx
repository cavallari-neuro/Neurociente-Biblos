import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#FDFBF7] z-50 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative">
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-oldGold/30 scale-150"
             />
             <div className="w-24 h-24 bg-charcoal rounded-2xl flex items-center justify-center shadow-xl mb-6 relative z-10">
                <BookOpen size={48} className="text-oldGold" />
             </div>
        </div>

        <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-3xl font-bold text-charcoal mb-2"
        >
          Caminhando
        </motion.h1>
        
        <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs font-bold tracking-[0.3em] text-bronze uppercase"
        >
          Na Bíblia
        </motion.span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10"
      >
        <div className="flex gap-1">
            <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-oldGold rounded-full" />
            <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 bg-oldGold rounded-full" />
            <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 bg-oldGold rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};