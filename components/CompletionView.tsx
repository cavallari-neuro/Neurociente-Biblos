import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, Share2, Home } from 'lucide-react';
import { Lesson } from '../types';

interface CompletionViewProps {
  lesson: Lesson;
  onHome: () => void;
}

export const CompletionView: React.FC<CompletionViewProps> = ({ lesson, onHome }) => {
  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="text-center pt-8 pb-20 space-y-8"
    >
        <div className="flex justify-center">
            <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-teal/10 flex items-center justify-center"
            >
                <CheckCircle size={48} className="text-teal" />
            </motion.div>
        </div>

        <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold text-charcoal">Sessão Concluída!</h1>
            <p className="text-gray-500">Você completou "{lesson.title}"</p>
        </div>

        {/* AI Insight Processing Placeholder */}
        <div className="mx-4 bg-white border border-gray-100 shadow-lg rounded-2xl p-6 text-left relative overflow-hidden">
             {/* Shimmer Effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>

            <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-oldGold" />
                <span className="text-xs font-bold text-oldGold uppercase tracking-wide">AI Insight (Beta)</span>
            </div>

            <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg border border-dashed border-gray-200">
                <span>Processando seu áudio e gerando feedback...</span>
                <span className="inline-block px-1.5 py-0.5 bg-gray-200 rounded text-[10px] font-bold">EM BREVE</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4">
             <button onClick={onHome} className="col-span-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-charcoal font-medium hover:bg-gray-50">
                <Home size={18} />
                Início
             </button>
             <button className="col-span-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-charcoal text-white font-medium hover:bg-gray-900 shadow-md">
                <Share2 size={18} />
                Compartilhar
             </button>
        </div>
    </motion.div>
  );
};