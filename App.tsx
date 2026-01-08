import React, { useEffect, useState } from 'react';
import { TenantProvider, useTenant } from './contexts/TenantContext';
import { Layout } from './components/Layout';
import { JourneyMap } from './components/JourneyMap';
import { SessionView } from './components/SessionView';
import { CompletionView } from './components/CompletionView';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { fetchJourneyData, fetchUserProgress } from './services/api';
import { Module, Lesson, UserProgress, LessonStatus } from './types';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { tenant } = useTenant();
  const [currentView, setCurrentView] = useState<'dashboard' | 'session' | 'completion' | 'ranking'>('dashboard');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const [modData, progData] = await Promise.all([fetchJourneyData(), fetchUserProgress()]);
      setModules(modData);
      setProgress(progData);
      setLoading(false);
    };
    init();
  }, []);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('session');
  };

  const handleSessionComplete = (audioBlob: Blob | null) => {
    // In a real app, upload blob here
    setCurrentView('completion');
  };

  const handleNavigate = (view: string) => {
      if(view === 'dashboard') {
          setCurrentView('dashboard');
          setSelectedLesson(null);
      } else if (view === 'ranking') {
          // Placeholder for ranking view
          alert("Ranking: Recurso 'Em Breve'");
      }
  };

  if (loading || !progress) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center text-charcoal">
        <Loader2 className="w-10 h-10 animate-spin text-oldGold mb-4" />
        <p className="font-serif text-lg animate-pulse">Sincronizando...</p>
      </div>
    );
  }

  return (
    <Layout tenant={tenant} onNavigate={handleNavigate} currentView={currentView}>
      {currentView === 'dashboard' && (
        <JourneyMap 
            modules={modules} 
            progress={progress} 
            onLessonSelect={handleLessonSelect} 
        />
      )}
      
      {currentView === 'session' && selectedLesson && (
        <SessionView 
            lesson={selectedLesson} 
            onBack={() => setCurrentView('dashboard')}
            onComplete={handleSessionComplete}
        />
      )}

      {currentView === 'completion' && selectedLesson && (
        <CompletionView 
            lesson={selectedLesson} 
            onHome={() => {
                setCurrentView('dashboard');
                // Optimistic update for demo purposes
                const newModules = [...modules];
                newModules[0].lessons[1].status = LessonStatus.COMPLETED;
                newModules[0].lessons[2].status = LessonStatus.AVAILABLE;
                setModules(newModules);
            }} 
        />
      )}
    </Layout>
  );
};

export default function App() {
  const [appState, setAppState] = useState<'SPLASH' | 'LOGIN' | 'APP'>('SPLASH');

  if (appState === 'SPLASH') {
    return <SplashScreen onFinish={() => setAppState('LOGIN')} />;
  }

  if (appState === 'LOGIN') {
    return <LoginScreen onLogin={() => setAppState('APP')} />;
  }

  return (
    <TenantProvider>
      <AppContent />
    </TenantProvider>
  );
}