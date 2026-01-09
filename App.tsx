
import React, { useState } from 'react';
import { TenantProvider, useTenant } from './contexts/TenantContext.tsx';
import { Layout } from './components/Layout.tsx';
import { JourneyScreen } from './screens/JourneyScreen.tsx';
import { ImpactScreen } from './screens/ImpactScreen.tsx';
import { CommunityScreen } from './screens/CommunityScreen.tsx';
import { SplashScreen } from './components/SplashScreen.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';

const AppRouter: React.FC = () => {
  const { tenant } = useTenant();
  const [currentView, setCurrentView] = useState<'dashboard' | 'global' | 'ranking'>('dashboard');

  return (
    <Layout tenant={tenant} onNavigate={(view) => setCurrentView(view as any)} currentView={currentView}>
      {currentView === 'dashboard' && <JourneyScreen />}
      {currentView === 'global' && <ImpactScreen />}
      {currentView === 'ranking' && <CommunityScreen />}
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
      <AppRouter />
    </TenantProvider>
  );
}
