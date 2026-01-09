
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IncentiveState, CommunityGlobalStatus, ActiveBookCommunity } from '../types.ts';
import { fetchUserIncentives, fetchCommunityGlobalStatus } from '../services/api.ts';
import { Loader2, Lock, Send, CheckCircle, Zap, Star, Sparkles, BookOpen, Users } from 'lucide-react';

export const ImpactScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [incentives, setIncentives] = useState<IncentiveState[]>([]);
  const [communityStatus, setCommunityStatus] = useState<CommunityGlobalStatus | null>(null);
  const [selectedIncentiveId, setSelectedIncentiveId] = useState<string | null>(null);
  const [justSentTo, setJustSentTo] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
        fetchUserIncentives(),
        fetchCommunityGlobalStatus()
    ]).then(([resIncentives, resStatus]) => {
      setIncentives(resIncentives);
      setCommunityStatus(resStatus);
      
      const firstAvailable = resIncentives.find(i => i.isUnlocked && !i.isSent);
      if (firstAvailable) setSelectedIncentiveId(firstAvailable.id);
      
      setLoading(false);
    });
  }, []);

  const handleSendToCluster = (bookName: string) => {
      if (!selectedIncentiveId) return;

      const incentiveIndex = incentives.findIndex(i => i.id === selectedIncentiveId);
      if (incentiveIndex === -1) return;
      if (incentives[incentiveIndex].isSent) return;

      const newIncentives = [...incentives];
      newIncentives[incentiveIndex].isSent = true;
      setIncentives(newIncentives);
      
      setJustSentTo(bookName);
      setTimeout(() => setJustSentTo(null), 3000);
      
      const nextAvailable = newIncentives.find(i => i.isUnlocked && !i.isSent);
      setSelectedIncentiveId(nextAvailable ? nextAvailable.id : null);
  };

  if (loading || !communityStatus) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-charcoal/50">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const selectedIncentiveObj = incentives.find(i => i.id === selectedIncentiveId);

  return (
    <div className="pb-24 flex flex-col h-[85vh]">
        <div className="flex-none mb-4">
            <h2 className="font-serif text-3xl font-bold text-charcoal">Plaza Global</h2>
            <p className="text-gray-500 text-sm">
                Envie luz para quem está lendo agora.
            </p>
        </div>

        {/* INVENTORY */}
        <div className="flex-none mb-6">
            <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seu Inventário</span>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-4 px-1 snap-x scrollbar-hide">
                {incentives.map((incentive) => (
                    <IncentiveInventoryItem 
                        key={incentive.id}
                        incentive={incentive}
                        isSelected={selectedIncentiveId === incentive.id}
                        onSelect={() => !incentive.isSent && incentive.isUnlocked && setSelectedIncentiveId(incentive.id)}
                    />
                ))}
            </div>
        </div>

        {/* MAIN PLAZA AREA */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-8 pr-2 pb-20">
             {selectedIncentiveObj && !justSentTo && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-xs text-teal font-medium bg-teal/5 py-2 rounded-lg border border-teal/10"
                >
                    Toque em um grupo abaixo para enviar: <span className="font-bold">{selectedIncentiveObj.label}</span>
                </motion.div>
             )}

             {justSentTo && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-oldGold text-white p-4 rounded-xl text-center shadow-lg"
                 >
                    <Sparkles className="inline-block mr-2" size={16}/>
                    Você enviou luz para os leitores de <strong>{justSentTo}</strong>!
                 </motion.div>
             )}

             <div className="grid grid-cols-1 gap-8">
                {communityStatus.activeClusters.map((cluster, idx) => (
                    <BookCommunityCluster 
                        key={cluster.bookName} 
                        cluster={cluster} 
                        canReceiveIncentive={!!selectedIncentiveObj}
                        onDropIncentive={() => handleSendToCluster(cluster.bookName)}
                        index={idx}
                    />
                ))}
             </div>
             
             <div className="text-center py-8 opacity-40">
                <BookOpen className="mx-auto mb-2" size={24} />
                <p className="text-xs font-serif italic">Mostrando livros ativos no momento.</p>
             </div>
        </div>
    </div>
  );
};

// --- Sub Components ---

const IncentiveInventoryItem: React.FC<{ 
    incentive: IncentiveState; 
    isSelected: boolean; 
    onSelect: () => void 
}> = ({ incentive, isSelected, onSelect }) => {
    let Icon = Star;
    let colorClass = "text-oldGold";
    let bgClass = "bg-oldGold/10";
    
    if (incentive.type === 'DAILY_MISSION') {
        Icon = CheckCircle;
        colorClass = "text-teal";
        bgClass = "bg-teal/10";
    } else if (incentive.type === 'STREAK_KEEPER') {
        Icon = Zap;
        colorClass = "text-coral";
        bgClass = "bg-coral/10";
    } else if (incentive.type === 'INSIGHT_MASTER') {
        Icon = Sparkles;
        colorClass = "text-purple-600";
        bgClass = "bg-purple-100";
    }

    if (!incentive.isUnlocked) {
        return (
            <div className="snap-start shrink-0 w-20 h-24 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center opacity-50">
                <Lock size={16} className="text-gray-300 mb-1" />
                <span className="text-[10px] text-gray-400">Bloqueado</span>
            </div>
        );
    }

    if (incentive.isSent) {
        return (
             <div className="snap-start shrink-0 w-20 h-24 bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center opacity-60">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                    <CheckCircle size={14} className="text-gray-400" />
                </div>
                <span className="text-[10px] font-bold text-gray-400">Enviado</span>
            </div>
        );
    }

    return (
        <motion.div 
            onClick={onSelect}
            whileTap={{ scale: 0.95 }}
            animate={isSelected ? { y: -5 } : { y: 0 }}
            className={`
                snap-start shrink-0 w-24 h-28 rounded-xl border-2 flex flex-col items-center justify-between p-3 cursor-pointer shadow-sm transition-all
                ${isSelected ? 'border-teal bg-white ring-2 ring-teal/20' : 'border-gray-100 bg-white'}
            `}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgClass}`}>
                <Icon size={16} className={colorClass} />
            </div>
            <div className="text-center">
                <p className="text-[10px] font-bold text-charcoal leading-tight line-clamp-2">{incentive.label}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">+{incentive.value} Luz</p>
            </div>
            {isSelected && (
                <div className="w-2 h-2 rounded-full bg-teal" />
            )}
        </motion.div>
    );
};

const BookCommunityCluster: React.FC<{ 
    cluster: ActiveBookCommunity; 
    canReceiveIncentive: boolean;
    onDropIncentive: () => void;
    index: number;
}> = ({ cluster, canReceiveIncentive, onDropIncentive, index }) => {
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative h-48 bg-[#F8F6F1] rounded-3xl border border-[#EBE5D9] overflow-hidden group"
        >
            {/* Background Title Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <span className="font-serif font-bold text-6xl text-charcoal">{cluster.bookName.substring(0, 3)}</span>
            </div>

            {/* Central Book Node */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="text-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/50 shadow-sm">
                    <h3 className="font-serif text-xl font-bold text-charcoal">{cluster.bookName}</h3>
                    <div className="flex items-center justify-center gap-1 text-gray-500 text-xs">
                        <Users size={10} />
                        <span>{cluster.totalReaders}</span>
                    </div>
                </div>
            </div>

            {/* Interaction Layer */}
            {canReceiveIncentive && (
                <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={onDropIncentive}
                        className="bg-charcoal text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-black hover:scale-105 transition-all"
                    >
                        <Send size={12} />
                        Enviar Incentivo
                    </button>
                </div>
            )}

            {/* Floating Avatars (Miiverse Style) */}
            {cluster.activeAvatars.map((avatar, i) => {
                const angle = (i / cluster.activeAvatars.length) * 2 * Math.PI;
                const radius = 35 + (i % 2) * 20; 
                const top = 50 + Math.sin(angle) * radius; 
                const left = 50 + Math.cos(angle) * radius; 

                return (
                    <FloatingAvatar 
                        key={avatar.id} 
                        avatar={avatar} 
                        top={`${top}%`} 
                        left={`${left}%`} 
                        delay={i * 0.5} 
                    />
                );
            })}
        </motion.div>
    );
};

const FloatingAvatar: React.FC<{ 
    avatar: ActiveBookCommunity['activeAvatars'][0]; 
    top: string; 
    left: string;
    delay: number;
}> = ({ avatar, top, left, delay }) => {
    return (
        <motion.div
            className="absolute z-0"
            style={{ top, left }}
            animate={{ 
                y: [0, -5, 0],
                x: [0, 2, 0]
            }}
            transition={{ 
                duration: 3 + Math.random(), 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: delay 
            }}
        >
            <div className="relative">
                {avatar.message && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9] }}
                        transition={{ 
                            duration: 4, 
                            times: [0, 0.1, 0.8, 1],
                            repeat: Infinity, 
                            repeatDelay: 5 + Math.random() * 5,
                            delay: delay + 2
                        }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm whitespace-nowrap z-20"
                    >
                        <span className="text-[8px] font-bold text-charcoal">{avatar.message}</span>
                        <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rotate-45 border-b border-r border-gray-100"></div>
                    </motion.div>
                )}
                <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: avatar.color }}
                >
                    {avatar.initial}
                </div>
            </div>
        </motion.div>
    );
};
