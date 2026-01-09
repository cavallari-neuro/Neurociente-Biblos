
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Module, UserProgress, LessonStatus, CommunityGlobalStatus } from '../types.ts';
import { ChevronLeft, Grid, Users, CheckCircle, Lock, AlertCircle, Book } from 'lucide-react';

interface BibleHeatmapProps {
    modules: Module[];
    progress: UserProgress | null;
    communityStatus: CommunityGlobalStatus | null;
}

// Simplified List of Books for Prototype
const BIBLE_BOOKS = [
    { name: "Gênesis", abbrev: "Gn" }, { name: "Êxodo", abbrev: "Êx" }, 
    { name: "Levítico", abbrev: "Lv" }, { name: "Números", abbrev: "Nm" },
    { name: "Salmos", abbrev: "Sl" }, { name: "Provérbios", abbrev: "Pv" },
    { name: "Isaías", abbrev: "Is" }, { name: "Mateus", abbrev: "Mt" },
    { name: "Marcos", abbrev: "Mc" }, { name: "Lucas", abbrev: "Lc" },
    { name: "João", abbrev: "Jo" }, { name: "Atos", abbrev: "At" },
    { name: "Romanos", abbrev: "Rm" }, { name: "Apocalipse", abbrev: "Ap" }
];

export const BibleHeatmap: React.FC<BibleHeatmapProps> = ({ modules, progress, communityStatus }) => {
    // State to toggle between "Library View" (All books) and "Book View" (Chapters)
    // Defaults to 'Lucas' to show current context immediately as per request
    const [currentBook, setCurrentBook] = useState<string | null>('Lucas');

    // --- VIEW 1: BOOK CHAPTERS (The "Zoomed In" View) ---
    const renderBookView = () => {
        const TOTAL_CHAPTERS = currentBook === 'Salmos' ? 50 : 24; // Mock chapter counts
        
        // Helper to calculate status per chapter
        const getChapterStatus = (chapterNum: number) => {
            if (currentBook !== 'Lucas') {
                // Mock logic for other books
                if (currentBook === 'Salmos') {
                    // Simulate missing one chapter in Psalms
                    return chapterNum === 23 ? 'AVAILABLE' : 'COMPLETED'; 
                }
                const bookIndex = BIBLE_BOOKS.findIndex(b => b.name === currentBook);
                const lucasIndex = BIBLE_BOOKS.findIndex(b => b.name === 'Lucas');
                return bookIndex < lucasIndex ? 'COMPLETED' : 'LOCKED';
            }

            // Real logic for Lucas based on props
            const allLessons = modules.flatMap(m => m.lessons);
            const chapterLessons = allLessons.filter(l => {
                const match = l.reference.match(/Lucas\s+(\d+)/);
                return match && parseInt(match[1]) === chapterNum;
            });

            if (chapterLessons.length === 0) return 'LOCKED';

            const hasActive = chapterLessons.some(l => l.status === LessonStatus.IN_PROGRESS || l.status === LessonStatus.AVAILABLE);
            const hasCompleted = chapterLessons.some(l => l.status === LessonStatus.COMPLETED);

            if (hasActive) return 'ACTIVE';
            if (hasCompleted) return 'COMPLETED';
            return 'LOCKED';
        };

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <button 
                        onClick={() => setCurrentBook(null)}
                        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-charcoal transition-colors bg-gray-100 px-3 py-1.5 rounded-lg"
                    >
                        <ChevronLeft size={14} />
                        Voltar à Biblioteca
                    </button>
                    <div className="flex items-center gap-2">
                        <Book size={14} className="text-teal" />
                        <h3 className="font-serif font-bold text-lg text-teal">{currentBook}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-8 gap-2">
                    {Array.from({ length: TOTAL_CHAPTERS }).map((_, i) => {
                        const chapterNum = i + 1;
                        const status = getChapterStatus(chapterNum);
                        
                        let bgClass = "bg-gray-50 border-transparent";
                        let textClass = "text-gray-300";
                        let glow = "";
                        
                        if (status === 'COMPLETED') {
                            bgClass = "bg-teal border-teal";
                            textClass = "text-white";
                        } else if (status === 'ACTIVE' || status === 'AVAILABLE') {
                            bgClass = "bg-oldGold border-oldGold";
                            textClass = "text-white";
                            glow = "shadow-[0_0_10px_rgba(207,181,59,0.4)] ring-2 ring-oldGold/20 scale-110 z-10";
                        }

                        return (
                            <motion.div
                                key={chapterNum}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.01 }}
                                className={`
                                    aspect-square rounded-lg border flex items-center justify-center text-[10px] font-bold transition-all relative
                                    ${bgClass} ${glow}
                                `}
                            >
                                <span className={textClass}>{chapterNum}</span>
                            </motion.div>
                        );
                    })}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400">Progresso do Livro</span>
                    <span className="text-xs font-bold text-charcoal">
                        {currentBook === 'Lucas' ? '12%' : currentBook === 'Salmos' ? '98%' : '100%'}
                    </span>
                </div>
            </div>
        );
    };

    // --- VIEW 2: LIBRARY (Social Heatmap) ---
    const renderLibraryView = () => {
        // Find max readers to normalize heatmap intensity
        const maxReaders = Math.max(...(communityStatus?.activeClusters.map(c => c.totalReaders) || [1]));
        const lucasIndex = BIBLE_BOOKS.findIndex(b => b.name === 'Lucas');

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm text-charcoal uppercase tracking-wider flex items-center gap-2">
                        <Grid size={14} className="text-teal" />
                        Biblioteca Global
                    </h3>
                    <div className="flex items-center gap-1.5 bg-oldGold/10 px-2 py-1 rounded-full border border-oldGold/20">
                        <Users size={12} className="text-oldGold" />
                        <span className="text-[10px] font-bold text-oldGold">
                            {communityStatus?.totalOnline || 0} online
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {BIBLE_BOOKS.map((book, index) => {
                        // 1. Social Data
                        const cluster = communityStatus?.activeClusters.find(c => c.bookName === book.name);
                        const readers = cluster?.totalReaders || 0;
                        const intensity = readers / maxReaders; // 0 to 1
                        
                        // 2. User Status Logic (Simulated)
                        let status: 'READ' | 'ACTIVE' | 'PARTIAL' | 'LOCKED' = 'LOCKED';
                        if (book.name === 'Lucas') status = 'ACTIVE';
                        else if (book.name === 'Salmos') status = 'PARTIAL';
                        else if (index < lucasIndex) status = 'READ';

                        return (
                            <motion.button
                                key={book.name}
                                onClick={() => setCurrentBook(book.name)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 flex flex-col items-center justify-center gap-1 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Heatmap Background Layer */}
                                <div 
                                    className="absolute inset-0 bg-teal transition-opacity duration-1000"
                                    style={{ opacity: intensity * 0.4 }} // Max 40% opacity for heatmap
                                />

                                {/* User Status Icon */}
                                <div className="relative z-10 mb-1">
                                    {status === 'READ' && <CheckCircle size={16} className="text-teal drop-shadow-sm" fill="white" />}
                                    {status === 'ACTIVE' && (
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-oldGold rounded-full animate-ping opacity-20" />
                                            <Book size={16} className="text-oldGold drop-shadow-sm" fill="currentColor" />
                                        </div>
                                    )}
                                    {status === 'PARTIAL' && <AlertCircle size={16} className="text-coral drop-shadow-sm" fill="white" />}
                                    {status === 'LOCKED' && <Lock size={14} className="text-gray-300" />}
                                </div>

                                {/* Book Abbreviation */}
                                <span className={`relative z-10 text-sm font-serif font-bold ${status === 'LOCKED' ? 'text-gray-400' : 'text-charcoal'}`}>
                                    {book.abbrev}
                                </span>

                                {/* Reader Count (Heatmap Label) */}
                                {readers > 0 && (
                                    <span className="absolute bottom-1 right-1 text-[8px] font-bold text-teal/80 bg-white/60 px-1 rounded backdrop-blur-sm">
                                        {readers}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
                 <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-400 italic">
                        Cores intensas indicam onde a comunidade está lendo.
                    </p>
                </div>
            </div>
        );
    };

    return (
        <motion.div 
            layout
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden"
        >
            <AnimatePresence mode="wait">
                {currentBook ? (
                    <motion.div 
                        key="book"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {renderBookView()}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="library"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {renderLibraryView()}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
