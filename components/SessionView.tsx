import React, { useState, useEffect } from 'react';
import { Lesson } from '../types.ts';
import { ArrowLeft, Book, Mic, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateInsightFeedback } from '../services/ai.ts';

interface SessionViewProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (feedback: string) => void;
}

export const SessionView: React.FC<SessionViewProps> = ({ lesson, onBack, onComplete }) => {
  const [step, setStep] = useState<'READING' | 'VIDEO' | 'INSIGHT'>('READING');
  
  return (
    <div className="pb-24">
      <div className="mb-6 flex items-center gap-2 text-gray-400 hover:text-charcoal cursor-pointer" onClick={onBack}>
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Voltar para o Mapa</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 'READING' && (
             <ReadingStep key="reading" lesson={lesson} onNext={() => setStep('VIDEO')} />
        )}
        {step === 'VIDEO' && (
             <VideoStep key="video" lesson={lesson} onNext={() => setStep('INSIGHT')} />
        )}
        {step === 'INSIGHT' && (
             <InsightStep key="insight" lesson={lesson} onComplete={onComplete} />
        )}
      </AnimatePresence>
    </div>
  );
};

const ReadingStep: React.FC<{ lesson: Lesson; onNext: () => void }> = ({ lesson, onNext }) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div className="bg-[#F4F1EA] p-8 rounded-2xl border border-[#E8E1D0] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Book size={120} />
            </div>
            
            <span className="inline-block px-3 py-1 bg-charcoal text-white text-xs font-bold rounded-full mb-4">
                PASSO 1: LEITURA FÍSICA
            </span>
            
            <h2 className="font-serif text-3xl font-bold text-charcoal mb-2">Abra sua Bíblia</h2>
            
            <div className="my-6 py-6 border-t border-b border-charcoal/10">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Referência</p>
                        <p className="text-2xl font-serif text-teal font-bold">{lesson.reference}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Página</p>
                        <p className="text-2xl font-serif text-charcoal font-bold">{lesson.pageNumber}</p>
                    </div>
                </div>
            </div>

            <p className="text-gray-600 leading-relaxed font-sans mb-8">
                {lesson.description} Leia com atenção e observe os detalhes do texto.
            </p>

            <button onClick={onNext} className="w-full bg-charcoal text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group">
                Concluí a Leitura
                <div className="w-1.5 h-1.5 rounded-full bg-oldGold group-hover:scale-150 transition-transform" />
            </button>
        </div>
    </motion.div>
);

const VideoStep: React.FC<{ lesson: Lesson; onNext: () => void }> = ({ lesson, onNext }) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div className="bg-charcoal text-white p-6 rounded-2xl relative overflow-hidden aspect-video flex flex-col items-center justify-center group cursor-pointer shadow-xl">
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${lesson.videoUrl || 'https://picsum.photos/800/450'})` }}></div>
            <div className="absolute inset-0 bg-black/30" />
            <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center z-10 border border-white/20">
                <Play size={24} fill="white" className="ml-1" />
            </motion.div>
            <div className="absolute bottom-4 left-4 z-10">
                <span className="text-xs font-bold bg-coral px-2 py-1 rounded">VÍDEO DE SÍNTESE</span>
                <p className="font-serif text-lg mt-2">{lesson.title}</p>
            </div>
        </div>
        <button onClick={onNext} className="w-full bg-white border-2 border-charcoal text-charcoal py-4 rounded-xl font-medium hover:bg-gray-50 transition-all">
            Prosseguir para Insight
        </button>
    </motion.div>
);

const InsightStep: React.FC<{ lesson: Lesson; onComplete: (feedback: string) => void }> = ({ lesson, onComplete }) => {
    const [status, setStatus] = useState<'IDLE' | 'RECORDING' | 'PROCESSING'>('IDLE');
    const [simulatedTime, setSimulatedTime] = useState(0);

    useEffect(() => {
        let interval: any;
        if (status === 'RECORDING') {
            interval = setInterval(() => {
                setSimulatedTime(prev => {
                    if (prev >= 100) {
                        setStatus('PROCESSING');
                        // Trigger AI generation
                        generateInsightFeedback(lesson).then(feedback => {
                            onComplete(feedback);
                        });
                        return 100;
                    }
                    return prev + 2; // ~5 seconds duration
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [status, lesson, onComplete]);

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
                <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">Insight Interativo</h2>
                <p className="text-gray-600">Grave um áudio curto explicando o que você aprendeu.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                {status === 'IDLE' && (
                    <div className="text-center space-y-4">
                         <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto">
                            <Mic size={32} className="text-teal" />
                        </div>
                        <p className="text-gray-500">Toque para gravar seu insight (Simulado).</p>
                        <button onClick={() => setStatus('RECORDING')} className="bg-teal text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto">
                            Iniciar Gravação
                        </button>
                    </div>
                )}
                
                {status === 'RECORDING' && (
                    <div className="text-center w-full max-w-xs">
                        <p className="text-teal font-bold mb-4 animate-pulse">Gravando...</p>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-teal" 
                                style={{ width: `${simulatedTime}%` }}
                            />
                        </div>
                    </div>
                )}

                {status === 'PROCESSING' && (
                    <div className="text-center w-full max-w-xs space-y-4">
                        <div className="w-16 h-16 border-4 border-oldGold border-t-transparent rounded-full animate-spin mx-auto"/>
                        <p className="text-oldGold font-bold animate-pulse">A IA está analisando seu insight...</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}