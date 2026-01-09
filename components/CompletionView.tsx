
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Share2, Home, Send, Heart } from 'lucide-react';
import { Lesson } from '../types.ts';

interface CompletionViewProps {
  lesson: Lesson;
  aiFeedback?: string;
  onHome: () => void;
}

export const CompletionView: React.FC<CompletionViewProps> = ({ lesson, aiFeedback, onHome }) => {
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (isShared) {
      const timer = setTimeout(() => {
        onHome();
      }, 2500); // Wait 2.5s before going home
      return () => clearTimeout(timer);
    }
  }, [isShared, onHome]);

  return (
    <div className="min-h-[70vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {!isShared ? (
          <motion.div 
              key="feedback-view"
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center pb-20 space-y-8"
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

              {/* AI Insight Result */}
              <div className="mx-4 bg-white border border-gray-100 shadow-lg rounded-2xl p-6 text-left relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={18} className="text-oldGold" />
                      <span className="text-xs font-bold text-oldGold uppercase tracking-wide">Mentor AI</span>
                  </div>

                  <p className="text-charcoal font-serif italic leading-relaxed text-lg">
                      "{aiFeedback || 'Obrigado por compartilhar seu insight. Continue firme na jornada!'}"
                  </p>

                  <div className="mt-6 flex items-center justify-end">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gerado por Gemini 2.5</span>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4 px-4">
                  <button onClick={onHome} className="col-span-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-charcoal font-medium hover:bg-gray-50">
                      <Home size={18} />
                      Início
                  </button>
                  <button 
                      onClick={() => setIsShared(true)}
                      className="col-span-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-charcoal text-white font-medium hover:bg-gray-900 shadow-md transition-all active:scale-95"
                  >
                      <Share2 size={18} />
                      Compartilhar
                  </button>
              </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-view"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center space-y-6 px-8"
          >
            <div className="relative">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-teal rounded-full blur-xl opacity-20"
                />
                <div className="w-24 h-24 bg-teal rounded-full flex items-center justify-center shadow-xl relative z-10">
                    <Send size={40} className="text-white ml-1" />
                </div>
                <motion.div 
                    initial={{ scale: 0, x: 20, y: 20 }}
                    animate={{ scale: 1, x: 30, y: -30, opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-0 right-0"
                >
                    <Heart size={24} className="text-coral fill-coral" />
                </motion.div>
            </div>

            <div>
                <h2 className="font-serif text-3xl font-bold text-charcoal mb-2">Enviado!</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                    Seu insight foi compartilhado.<br/>
                    Você acaba de gerar <strong className="text-teal">luz</strong> para a comunidade.
                </p>
            </div>
            
            <div className="mt-8">
                <p className="text-xs text-gray-400 uppercase tracking-widest animate-pulse">Retornando à jornada...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
