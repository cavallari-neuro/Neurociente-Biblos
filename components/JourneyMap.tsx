import React from 'react';
import { Module, Lesson, LessonStatus, UserProgress } from '../types';
import { Lock, Play, CheckCircle, ChevronRight, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyMapProps {
  modules: Module[];
  progress: UserProgress;
  onLessonSelect: (lesson: Lesson) => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ modules, progress, onLessonSelect }) => {
  
  // Find the next available lesson (First one that is IN_PROGRESS or AVAILABLE)
  const nextLesson = React.useMemo(() => {
    for (const mod of modules) {
        for (const lesson of mod.lessons) {
            if (lesson.status === LessonStatus.IN_PROGRESS || lesson.status === LessonStatus.AVAILABLE) {
                return lesson;
            }
        }
    }
    return null;
  }, [modules]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Stat */}
      <div className="flex justify-between items-end mb-4">
        <div>
            <h2 className="font-serif text-3xl font-bold text-charcoal">Sua Jornada</h2>
            <p className="text-sm text-gray-500">Olá, Estudante</p>
        </div>
        <div className="text-right bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1 text-teal font-bold">
                <Zap size={14} fill="currentColor" />
                <span>{progress.currentStreak} dias</span>
            </div>
        </div>
      </div>

      {/* MISSÃO DO DIA (Featured Card) */}
      {nextLesson && (
        <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
        >
            <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-oldGold" fill="currentColor" />
                <span className="text-xs font-bold tracking-widest uppercase text-oldGold">Missão do Dia</span>
            </div>
            
            <div 
                onClick={() => onLessonSelect(nextLesson)}
                className="bg-charcoal text-white p-6 rounded-2xl shadow-xl cursor-pointer relative overflow-hidden group"
            >
                {/* Background Image Effect */}
                <div 
                    className="absolute inset-0 opacity-20 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${nextLesson.videoUrl || 'https://picsum.photos/800/400'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold border border-white/20">
                            {nextLesson.reference}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-oldGold text-charcoal flex items-center justify-center">
                            <Play size={14} fill="currentColor" />
                        </div>
                    </div>
                    
                    <h3 className="font-serif text-2xl font-bold mb-2 leading-tight max-w-[80%]">
                        {nextLesson.title}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-2 max-w-[90%]">
                        {nextLesson.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
                        <span>Toque para iniciar</span>
                        <ChevronRight size={14} />
                    </div>
                </div>
            </div>
        </motion.div>
      )}

      {/* The Timeline */}
      <div className="relative pl-4">
        {/* The Vertical "Root/Circuit" Line */}
        <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gray-200">
             <motion.div 
                initial={{ height: 0 }}
                animate={{ height: '60%' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-full bg-gradient-to-b from-teal to-coral opacity-50"
             />
        </div>

        <div className="space-y-12">
            {modules.map((module, mIdx) => (
                <div key={module.id} className="relative">
                    <div className="mb-4 pl-12">
                        <h3 className="font-serif text-xl font-semibold text-charcoal">{module.title}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{module.description}</p>
                    </div>

                    <div className="space-y-6">
                        {module.lessons.map((lesson, lIdx) => (
                            <JourneyNode 
                                key={lesson.id} 
                                lesson={lesson} 
                                onClick={() => onLessonSelect(lesson)}
                                isLast={mIdx === modules.length - 1 && lIdx === module.lessons.length - 1}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      {/* Social Ranking Teaser (Coming Soon) */}
      <div className="mt-12 bg-gray-50 rounded-xl p-4 border border-dashed border-gray-300">
        <div className="flex items-center gap-3 opacity-60">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Zap size={18} />
            </div>
            <div>
                <h4 className="font-bold text-sm text-gray-500">Ranking da Turma</h4>
                <p className="text-xs text-gray-400">Em breve: veja quem está no Top 20</p>
            </div>
        </div>
      </div>
    </div>
  );
};

const JourneyNode: React.FC<{ lesson: Lesson; onClick: () => void; isLast: boolean }> = ({ lesson, onClick, isLast }) => {
    
    let Icon = Lock;
    let nodeColor = "bg-white border-gray-200 text-gray-300";
    let lineColor = "bg-gray-200";
    let glow = "";

    if (lesson.status === LessonStatus.COMPLETED) {
        Icon = CheckCircle;
        nodeColor = "bg-teal border-teal text-white";
        lineColor = "bg-teal";
    } else if (lesson.status === LessonStatus.AVAILABLE) {
        Icon = Play;
        nodeColor = "bg-white border-coral text-coral";
        lineColor = "bg-coral";
        glow = "shadow-[0_0_15px_rgba(255,127,80,0.3)]";
    } else if (lesson.status === LessonStatus.IN_PROGRESS) {
        Icon = Play;
        nodeColor = "bg-white border-oldGold text-oldGold";
    }

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center gap-4 cursor-pointer group"
            onClick={lesson.status !== LessonStatus.LOCKED ? onClick : undefined}
        >
            {/* Horizontal Connector */}
            <div className={`absolute left-[11px] w-8 h-0.5 ${lesson.status === LessonStatus.COMPLETED ? 'bg-teal/50' : 'bg-gray-200'} transition-colors duration-500`} />

            {/* The Node */}
            <div className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${nodeColor} ${glow}`}>
                <Icon size={20} strokeWidth={2.5} />
            </div>

            {/* The Card */}
            <div className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${lesson.status !== LessonStatus.LOCKED ? 'bg-white border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-coral/30' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold tracking-wider text-bronze uppercase">
                        {lesson.reference}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        Pg. {lesson.pageNumber}
                    </span>
                </div>
                <h4 className="font-serif font-semibold text-charcoal leading-tight">
                    {lesson.title}
                </h4>
            </div>
        </motion.div>
    );
};