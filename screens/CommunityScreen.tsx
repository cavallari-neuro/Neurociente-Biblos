
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Echo, CommunityGoal, IncentiveState } from '../types.ts';
import { fetchCommunityEchoes, fetchCommunityGoal, fetchUserIncentives } from '../services/api.ts';
import { useTenant } from '../contexts/TenantContext.tsx';
import { Loader2, Quote, Hand, Sparkles, Map, Users, X, Send, Lock, CheckCircle, Zap, Star, Clock, Flame, BookOpen, Minimize2, ZoomIn, ZoomOut, Maximize2, User } from 'lucide-react';

export const CommunityScreen: React.FC = () => {
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [goal, setGoal] = useState<CommunityGoal | null>(null);
  const [incentives, setIncentives] = useState<IncentiveState[]>([]);
  
  // Interaction State
  const [selectedEcho, setSelectedEcho] = useState<Echo | null>(null);
  const [showIncentiveSelector, setShowIncentiveSelector] = useState(false);
  const [sentIncentiveFeedback, setSentIncentiveFeedback] = useState<string | null>(null);

  // Constants to define "Current Context" (In a real app, this comes from UserProgress)
  const CURRENT_USER_REF = "Lucas 1:5-25";

  useEffect(() => {
    Promise.all([
        fetchCommunityEchoes(),
        fetchCommunityGoal(),
        fetchUserIncentives()
    ]).then(([resEchoes, resGoal, resIncentives]) => {
      setEchoes(resEchoes);
      setGoal(resGoal);
      setIncentives(resIncentives);
      setLoading(false);
    });
  }, []);

  // SORTING LOGIC:
  // 1. Current User (Center)
  // 2. Peers reading the same reference (Inner Circle)
  // 3. Others (Outer Spiral)
  const sortedEchoes = useMemo(() => {
      return [...echoes].sort((a, b) => {
          // Priority 1: Current User
          if (a.isCurrentUser) return -1;
          if (b.isCurrentUser) return 1;

          // Priority 2: Same Reference
          const aIsPeer = a.bibleReference === CURRENT_USER_REF;
          const bIsPeer = b.bibleReference === CURRENT_USER_REF;

          if (aIsPeer && !bIsPeer) return -1;
          if (!aIsPeer && bIsPeer) return 1;

          // Priority 3: Random/Default (Keep original order or sort by reaction count)
          return 0;
      });
  }, [echoes]);

  const handleReaction = (echoId: string, type: 'AMEM' | 'LUZ' | 'CAMINHO') => {
      setEchoes(prev => prev.map(echo => {
          if (echo.id !== echoId) return echo;
          
          const isSelected = echo.userReaction === type;
          const newEcho = {
              ...echo,
              userReaction: isSelected ? undefined : type,
              reactions: {
                  ...echo.reactions,
                  [type.toLowerCase()]: isSelected 
                      ? echo.reactions[type.toLowerCase() as keyof typeof echo.reactions] - 1 
                      : echo.reactions[type.toLowerCase() as keyof typeof echo.reactions] + 1
              }
          };
          
          if (selectedEcho?.id === echoId) {
             setSelectedEcho(newEcho);
          }
          return newEcho;
      }));
  };

  const handleSendIncentive = (incentiveId: string) => {
      if (!selectedEcho) return;
      const updatedIncentives = incentives.map(i => 
          i.id === incentiveId ? { ...i, isSent: true } : i
      );
      setIncentives(updatedIncentives);
      const sentIncentive = incentives.find(i => i.id === incentiveId);
      setSentIncentiveFeedback(sentIncentive?.label || 'Incentivo');
      setShowIncentiveSelector(false);
      setTimeout(() => {
          setSentIncentiveFeedback(null);
          setSelectedEcho(null); 
      }, 2500);
  };

  if (loading || !goal) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-charcoal/50">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-24 flex flex-col h-[85vh]">
        
        {/* TOP: Fixed Content (Tenant + Goal) */}
        <div className="flex-none space-y-5 mb-5">
            {/* Tenant Identity */}
            {tenant && (
                <section className="relative overflow-hidden rounded-2xl shadow-lg text-white p-5">
                    <div 
                        className="absolute inset-0 z-0 opacity-100" 
                        style={{ backgroundColor: tenant.primaryColor }} 
                    />
                    <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-2xl" />
                    
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shrink-0">
                            <Quote size={20} className="text-white" fill="white" />
                        </div>
                        <div>
                            <p className="font-serif italic text-lg leading-snug opacity-95">
                                "{tenant.weeklyMessage}"
                            </p>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-70 mt-2">
                                — {tenant.leaderName}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Enhanced Collective Goal Card */}
            <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Users size={14} className="text-teal" />
                            <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wide">Meta Semanal da Comunidade</h3>
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-charcoal">{goal.title}</h2>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-teal">{goal.percentage}%</span>
                    </div>
                </div>

                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-5 relative z-10">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-teal rounded-full relative"
                    >
                        <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-white/30 to-transparent" />
                    </motion.div>
                </div>

                {/* Detailed Stats Grid */}
                <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 relative z-10">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                            <Clock size={12} />
                            <span className="text-[9px] font-bold uppercase">Minutos</span>
                        </div>
                        <span className="text-sm font-bold text-charcoal">{goal.weeklyStats.totalMinutesRead}</span>
                    </div>
                    <div className="text-center border-l border-gray-100">
                        <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                            <Users size={12} />
                            <span className="text-[9px] font-bold uppercase">Ativos</span>
                        </div>
                        <span className="text-sm font-bold text-charcoal">{goal.weeklyStats.activeParticipants}</span>
                    </div>
                    <div className="text-center border-l border-gray-100">
                        <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                            <Sparkles size={12} />
                            <span className="text-[9px] font-bold uppercase">Insights</span>
                        </div>
                        <span className="text-sm font-bold text-charcoal">{goal.weeklyStats.insightsShared}</span>
                    </div>
                </div>
            </section>
        </div>

        {/* MIDDLE: Interactive Echo Map */}
        <EchoCloudMap 
            echoes={sortedEchoes} 
            onSelectEcho={setSelectedEcho} 
        />

        {/* MODAL: Echo Detail & Interaction */}
        <AnimatePresence>
            {selectedEcho && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
                        onClick={() => setSelectedEcho(null)}
                    />
                    
                    <motion.div 
                        layoutId={`echo-${selectedEcho.id}`}
                        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10"
                    >
                        {/* Modal Content */}
                        <div className="bg-paper p-6 pb-4 relative">
                             <button 
                                onClick={() => setSelectedEcho(null)}
                                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                             >
                                 <X size={16} className="text-charcoal" />
                             </button>

                             <div className="flex items-center gap-3 mb-4">
                                <div 
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm"
                                    style={{ backgroundColor: selectedEcho.userAvatarColor }}
                                >
                                    {selectedEcho.isCurrentUser ? <User size={24} /> : selectedEcho.userName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-charcoal text-lg leading-none">{selectedEcho.userName}</h3>
                                    <span className="text-xs text-gray-400">{selectedEcho.timestamp} • {selectedEcho.bibleReference}</span>
                                </div>
                             </div>

                             <div className="relative">
                                 <Quote className="absolute -top-2 -left-2 text-oldGold/20 transform scale-x-[-1]" size={32} />
                                 <p className="font-serif text-xl text-charcoal leading-relaxed relative z-10 pl-4">
                                     "{selectedEcho.content}"
                                 </p>
                             </div>
                        </div>

                        <div className="p-6 pt-0 bg-paper">
                            {!showIncentiveSelector && !sentIncentiveFeedback && (
                                <div className="space-y-6">
                                    <div className="flex gap-2">
                                        <ReactionButton 
                                            label="Amém" count={selectedEcho.reactions.amem} active={selectedEcho.userReaction === 'AMEM'}
                                            onClick={() => handleReaction(selectedEcho.id, 'AMEM')} icon={Hand} color="text-teal" bgColor="bg-teal/10"
                                        />
                                        <ReactionButton 
                                            label="Luz" count={selectedEcho.reactions.luz} active={selectedEcho.userReaction === 'LUZ'}
                                            onClick={() => handleReaction(selectedEcho.id, 'LUZ')} icon={Sparkles} color="text-oldGold" bgColor="bg-oldGold/10"
                                        />
                                        <ReactionButton 
                                            label="Caminho" count={selectedEcho.reactions.caminho} active={selectedEcho.userReaction === 'CAMINHO'}
                                            onClick={() => handleReaction(selectedEcho.id, 'CAMINHO')} icon={Map} color="text-coral" bgColor="bg-coral/10"
                                        />
                                    </div>
                                    {!selectedEcho.isCurrentUser && (
                                        <button 
                                            onClick={() => setShowIncentiveSelector(true)}
                                            className="w-full py-3 bg-charcoal text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                                        >
                                            <Send size={16} />
                                            Enviar Incentivo Individual
                                        </button>
                                    )}
                                </div>
                            )}

                            {showIncentiveSelector && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-charcoal">Escolha um Incentivo</h4>
                                        <button onClick={() => setShowIncentiveSelector(false)} className="text-xs text-gray-400 underline">Cancelar</button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {incentives.map(incentive => (
                                            <button
                                                key={incentive.id}
                                                disabled={!incentive.isUnlocked || incentive.isSent}
                                                onClick={() => handleSendIncentive(incentive.id)}
                                                className={`
                                                    flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                                                    ${!incentive.isUnlocked ? 'bg-gray-50 border-gray-100 opacity-50' : 'bg-white border-gray-200 hover:border-teal hover:bg-teal/5'}
                                                    ${incentive.isSent ? 'opacity-40 cursor-not-allowed' : ''}
                                                `}
                                            >
                                                {getIncentiveIcon(incentive.type)}
                                                <span className="text-[9px] font-bold text-charcoal mt-2 text-center leading-tight">{incentive.label}</span>
                                                <span className="text-[8px] text-gray-400 mt-0.5">+{incentive.value}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {sentIncentiveFeedback && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center"
                                >
                                    <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={32} className="text-teal" />
                                    </div>
                                    <h4 className="font-serif text-xl font-bold text-charcoal">Enviado com Sucesso!</h4>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};

// --- NEW COMPONENT: EchoCloudMap ---

interface EchoCloudMapProps {
    echoes: Echo[];
    onSelectEcho: (echo: Echo) => void;
}

const EchoCloudMap: React.FC<EchoCloudMapProps> = ({ echoes, onSelectEcho }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    
    // Constraints for dragging
    const canvasRef = useRef<HTMLDivElement>(null);

    // Reset zoom when closing
    useEffect(() => {
        if (!isExpanded) setZoomLevel(1);
    }, [isExpanded]);

    const handleExpand = () => {
        if (!isExpanded) setIsExpanded(true);
    };

    const handleZoomToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setZoomLevel(prev => prev === 1 ? 0.5 : 1);
    };

    // Only show top 15 in mini view, all in expanded
    const visibleEchoes = isExpanded ? echoes : echoes.slice(0, 15);

    return (
        <motion.div 
            layout
            // REMOVED 'transition-all duration-500' to avoid conflict with Framer Motion layout animations
            className={`
                relative bg-[#F8F6F1] border border-[#EBE5D9] overflow-hidden
                ${isExpanded ? 'fixed inset-0 z-[60] rounded-none' : 'flex-1 rounded-3xl min-h-0'}
            `}
            onClick={handleExpand}
        >
             {/* Header UI - Adapts to Mode */}
             <div className="absolute top-4 left-0 right-0 flex flex-col items-center z-20 pointer-events-none">
                 {!isExpanded && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                         <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/60 mb-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal">Ciclo Diário</span>
                         </div>
                         <h2 className="font-serif text-xl font-bold text-charcoal/80">Ecos da Palavra</h2>
                         <span className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest bg-white/40 px-2 rounded">Toque para Expandir</span>
                     </motion.div>
                 )}
                 {isExpanded && (
                     <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 pointer-events-auto bg-white/80 backdrop-blur shadow-sm px-4 py-2 rounded-full border border-gray-200">
                         <Map size={14} className="text-teal" />
                         <span className="text-xs font-bold text-charcoal">Mapa de Interações</span>
                         <span className="text-[10px] text-gray-500 border-l border-gray-300 pl-2 ml-1">
                             Você e seus vizinhos de leitura
                         </span>
                     </motion.div>
                 )}
             </div>

             {/* Controls (Expanded Only) */}
             {isExpanded && (
                 <>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                        className="absolute top-4 right-4 z-50 bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                        <Minimize2 size={20} className="text-charcoal" />
                    </button>
                    
                    <div className="absolute bottom-8 right-4 z-50 flex flex-col gap-2 pointer-events-auto">
                        <button 
                            onClick={handleZoomToggle}
                            className="bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 text-charcoal"
                        >
                            {zoomLevel === 1 ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                        </button>
                    </div>

                    <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none opacity-50">
                        <p className="text-xs font-bold text-charcoal bg-white/30 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                            Arraste para explorar
                        </p>
                    </div>
                 </>
             )}
            
             {/* Background Grid for Expanded View */}
             {isExpanded && (
                 <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                      style={{ 
                          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
                          backgroundSize: '20px 20px' 
                      }} 
                 />
             )}

             {/* Background Decoration (Static) */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                 <div className="w-64 h-64 rounded-full border-2 border-charcoal/20" />
                 <div className="absolute w-48 h-48 rounded-full border border-charcoal/20" />
             </div>

             {/* DRAGGABLE CANVAS CONTAINER */}
             <div className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing">
                 <motion.div
                    ref={canvasRef}
                    className="relative"
                    // MOVED WIDTH/HEIGHT TO ANIMATE PROP FOR SMOOTH TRANSITION
                    animate={{ 
                        width: isExpanded ? 2000 : 350, 
                        height: isExpanded ? 2000 : 350,
                        scale: zoomLevel,
                        x: isExpanded ? undefined : 0, // FORCE RESET TO CENTER
                        y: isExpanded ? undefined : 0  // FORCE RESET TO CENTER
                    }}
                    drag={isExpanded}
                    dragConstraints={{ left: -800, right: 800, top: -800, bottom: 800 }}
                    dragElastic={0.1}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                 >
                    {visibleEchoes.map((echo, idx) => (
                        <SpiralEchoNode 
                           key={echo.id} 
                           echo={echo} 
                           index={idx}
                           total={echoes.length}
                           isExpanded={isExpanded}
                           onClick={() => onSelectEcho(echo)}
                        />
                    ))}
                 </motion.div>
             </div>
        </motion.div>
    );
};

// --- Helper Components ---

const SpiralEchoNode: React.FC<{ 
    echo: Echo; 
    index: number; 
    total: number; 
    isExpanded: boolean;
    onClick: () => void 
}> = ({ echo, index, total, isExpanded, onClick }) => {
    
    // Archimedean Spiral Logic
    // Since index 0 is Current User, radius will be 0 (Center)
    
    const spreadFactor = isExpanded ? 45 : 14; 
    const baseRadius = 0; // Start exactly at center for index 0

    // Skip index 0 in calculation effectively to avoid gap, or just use index directly.
    // If index is 0 -> radius 0.
    const angle = index * 2.4; 
    const radius = baseRadius + (index * spreadFactor);

    const xOffset = radius * Math.cos(angle);
    const yOffset = radius * Math.sin(angle);

    const style: React.CSSProperties = {
        top: `calc(50% + ${yOffset}px)`,
        left: `calc(50% + ${xOffset}px)`,
    };

    const totalReactions = echo.reactions.amem + echo.reactions.luz + echo.reactions.caminho;
    const isHot = totalReactions > 50; 
    const isWarm = totalReactions > 20;

    return (
        <motion.div
            layout // Added layout prop here to animate position changes smoothly
            className="absolute z-10"
            style={style}
            animate={{ 
                y: [0, -6, 0], 
            }}
            transition={{ 
                layout: { duration: 0.5, ease: "easeInOut" },
                y: { 
                    duration: 3 + (index % 4), 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.1 
                } 
            }}
        >
            <motion.button 
                whileHover={{ scale: 1.25, zIndex: 100 }}
                onTap={(e) => { e.stopPropagation(); onClick(); }}
                className="relative group flex items-center justify-center"
            >
                {/* Visuals for Current User */}
                {echo.isCurrentUser && (
                    <div className="absolute inset-0 -m-4 border border-teal/20 rounded-full animate-pulse z-0" />
                )}

                {/* Glowing Aura for Hot Echoes */}
                {isHot && !echo.isCurrentUser && (
                    <motion.div 
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-oldGold rounded-full blur-md"
                    />
                )}

                <div 
                    className={`
                        rounded-full flex items-center justify-center text-xs font-bold text-white transition-all relative z-10
                        ${echo.isCurrentUser 
                            ? 'bg-charcoal border-4 border-teal w-14 h-14 shadow-xl z-50' 
                            : `border-2 ${isHot ? 'border-oldGold shadow-[0_0_15px_rgba(207,181,59,0.6)]' : 'border-white shadow-md'} ${isExpanded ? 'w-12 h-12 text-sm' : 'w-10 h-10 text-xs'}`
                        }
                    `}
                    style={{ backgroundColor: echo.isCurrentUser ? '#1A1A1A' : echo.userAvatarColor }}
                >
                    {echo.isCurrentUser ? <User size={20} className="text-teal" /> : echo.userName.charAt(0)}
                </div>

                {/* Name Label */}
                {(isExpanded || isHot || echo.isCurrentUser) && (
                    <div className={`
                        absolute top-full mt-1 bg-charcoal/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm whitespace-nowrap z-20 pointer-events-none transition-opacity
                        ${(isHot || echo.isCurrentUser) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                    `}>
                        {echo.isCurrentUser ? "VOCÊ" : echo.userName.split(' ')[0]}
                    </div>
                )}
                
                {/* Hot Badge */}
                {isHot && !echo.isCurrentUser && (
                    <div className="absolute -top-2 -right-2 z-20 bg-white rounded-full p-0.5 shadow-sm border border-oldGold">
                        <Flame size={12} className="text-oldGold fill-oldGold" />
                    </div>
                )}
            </motion.button>
        </motion.div>
    );
};

const ReactionButton: React.FC<{ 
    label: string; count: number; active: boolean; onClick: () => void; icon: React.ElementType; color: string; bgColor: string;
}> = ({ label, count, active, onClick, icon: Icon, color, bgColor }) => {
    return (
        <button 
            onClick={onClick}
            className={`
                flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-bold transition-all
                ${active ? `${bgColor} ${color} ring-1 ring-inset ring-black/5` : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}
            `}
        >
            <Icon size={18} fill={active ? "currentColor" : "none"} />
            <span>{count > 0 ? count : label}</span>
        </button>
    );
};

const getIncentiveIcon = (type: string) => {
    switch(type) {
        case 'DAILY_MISSION': return <CheckCircle size={20} className="text-teal" />;
        case 'STREAK_KEEPER': return <Zap size={20} className="text-coral" />;
        case 'INSIGHT_MASTER': return <Star size={20} className="text-oldGold" />;
        default: return <Sparkles size={20} className="text-gray-400" />;
    }
};
