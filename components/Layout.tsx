
import React from 'react';
import { Tenant } from '../types.ts';
import { BookOpen, Users, HeartHandshake, Settings } from 'lucide-react'; // Changed icons
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  tenant: Tenant | null;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, tenant, onNavigate, currentView }) => {
  return (
    <div className="min-h-screen bg-paper font-sans text-charcoal selection:bg-oldGold selection:text-white flex flex-col">
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-oldGold/20">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3" onClick={() => onNavigate('dashboard')}>
            <div className="p-2 bg-charcoal rounded-lg cursor-pointer">
               <BookOpen className="w-5 h-5 text-oldGold" />
            </div>
            <div className="flex flex-col cursor-pointer">
                <span className="font-serif font-bold text-lg leading-none">Caminhando</span>
                <span className="text-[10px] tracking-widest uppercase text-bronze">Na Bíblia</span>
            </div>
          </div>
          
          {tenant && (
            <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-600 text-right leading-tight max-w-[140px]">
                    {tenant.name}
                </span>
                <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    style={{ backgroundColor: tenant.primaryColor }}
                >
                    {tenant.name.substring(0, 2).toUpperCase()}
                </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6 relative">
        <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-50">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
            <NavButton 
                active={currentView === 'dashboard'} 
                icon={<BookOpen size={20} />} 
                label="Jornada" 
                onClick={() => onNavigate('dashboard')}
            />
            <NavButton 
                active={currentView === 'global'} 
                icon={<HeartHandshake size={20} />} 
                label="Impacto" 
                onClick={() => onNavigate('global')}
            />
            <NavButton 
                active={currentView === 'ranking'} 
                icon={<Users size={20} />} 
                label="Comunidade" 
                onClick={() => onNavigate('ranking')}
            />
             <NavButton 
                active={false} 
                icon={<Settings size={20} />} 
                label="Ajustes" 
                onClick={() => {}}
            />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-teal' : 'text-gray-400 hover:text-charcoal'}`}
    >
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
        {active && <motion.div layoutId="nav-dot" className="w-1 h-1 bg-teal rounded-full absolute bottom-2" />}
    </button>
);
