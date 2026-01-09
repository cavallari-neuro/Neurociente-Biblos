
import React, { useState, useEffect } from 'react';
import { JourneyMap } from '../components/JourneyMap.tsx';
import { SessionView } from '../components/SessionView.tsx';
import { CompletionView } from '../components/CompletionView.tsx';
import { BibleHeatmap } from '../components/BibleHeatmap.tsx'; // Import Heatmap
import { fetchJourneyData, fetchUserProgress, fetchCommunityGlobalStatus } from '../services/api.ts';
import { Module, Lesson, UserProgress, LessonStatus, CommunityGlobalStatus } from '../types.ts';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const JourneyScreen: React.FC = () => {
  // State specific to the Journey Flow
  const [viewState, setViewState] = useState<'MAP' | 'SESSION' | 'COMPLETION'>('MAP');
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [communityStatus, setCommunityStatus] = useState<CommunityGlobalStatus | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Data Fetching isolated to this screen
  useEffect(() => {
    const loadData = async () => {
      try {
        const [modData, progData, commData] = await Promise.all([
            fetchJourneyData(), 
            fetchUserProgress(),
            fetchCommunityGlobalStatus()
        ]);
        setModules(modData);
        setProgress(progData);
        setCommunityStatus(commData);
      } catch (e) {
        console.error("Journey Load Error", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handlers
  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setViewState('SESSION');
  };

  const handleSessionComplete = (feedback: string) => {
    setAiFeedback(feedback);
    setViewState('COMPLETION');
  };

  const handleReturnHome = () => {
    setViewState('MAP');
    setSelectedLesson(null);
    
    // Optimistic update for demo purposes
    if (modules.length > 0 && modules[0].lessons.length > 2) {
        const newModules = [...modules];
        // Simulate unlocking next stuff
        if(newModules[0].lessons[1]) newModules[0].lessons[1].status = LessonStatus.COMPLETED;
        if(newModules[0].lessons[2]) newModules[0].lessons[2].status = LessonStatus.AVAILABLE;
        setModules(newModules);
    }
  };

  if (loading || !progress) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-charcoal/50">
        <Loader2 className="w-8 h-8 animate-spin text-oldGold mb-2" />
        <span className="text-xs font-serif">Carregando sua jornada...</span>
      </div>
    );
  }

  // View Router for Journey Sub-states
  if (viewState === 'SESSION' && selectedLesson) {
    return (
        <SessionView 
            lesson={selectedLesson} 
            onBack={() => setViewState('MAP')}
            onComplete={handleSessionComplete}
        />
    );
  }

  if (viewState === 'COMPLETION' && selectedLesson) {
    return (
        <CompletionView 
            lesson={selectedLesson}
            aiFeedback={aiFeedback}
            onHome={handleReturnHome}
        />
    );
  }

  // Modified Map View with Heatmap
  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end mb-2">
        <div>
            <h2 className="font-serif text-3xl font-bold text-charcoal">Sua Jornada</h2>
            <p className="text-sm text-gray-500">Olá, Estudante</p>
        </div>
        <div className="text-right bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1 text-teal font-bold">
                <span className="text-xs uppercase tracking-wide text-gray-400 mr-1">Ritmo</span>
                <span>{progress.currentStreak} dias</span>
            </div>
        </div>
      </div>

      {/* NEW HEATMAP COMPONENT - Now receives communityStatus */}
      <BibleHeatmap 
          modules={modules} 
          progress={progress} 
          communityStatus={communityStatus}
      />

      <JourneyMap 
          modules={modules} 
          progress={progress} 
          onLessonSelect={handleLessonSelect} 
      />
    </div>
  );
};
