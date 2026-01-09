
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CommunityMember } from '../types.ts';
import { fetchCommunityMembers } from '../services/api.ts';
import { Heart, Book, AlignLeft, Send, Crown } from 'lucide-react';

export const RankingView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<CommunityMember[]>([]);

  useEffect(() => {
    fetchCommunityMembers().then(res => {
      setMembers(res);
      setLoading(false);
    });
  }, []);

  const handleLike = (id: string) => {
      setMembers(prev => prev.map(m => {
          if (m.userId === id) {
              return {
                  ...m,
                  likesReceived: m.isLikedByCurrentUser ? m.likesReceived - 1 : m.likesReceived + 1,
                  isLikedByCurrentUser: !m.isLikedByCurrentUser
              }
          }
          return m;
      }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <div className="pb-24">
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold text-charcoal">Comunidade</h2>
        <p className="text-gray-500 text-sm">Os maiores semeadores de incentivos.</p>
      </div>

      {loading ? (
        <SkeletonCommunity />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          {members.map((member) => (
            <CommunityCard key={member.userId} member={member} onLike={() => handleLike(member.userId)} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

const CommunityCard: React.FC<{ member: CommunityMember; onLike: () => void }> = ({ member, onLike }) => {
    const isTop3 = member.rank <= 3;
    const isCurrentUser = member.name === "Você";

    return (
        <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className={`relative bg-white rounded-2xl p-4 border shadow-sm ${isCurrentUser ? 'border-teal/30 bg-teal/5' : 'border-gray-100'}`}
        >
            {isTop3 && (
                <div className="absolute -top-3 -right-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md text-white font-bold text-xs ${member.rank === 1 ? 'bg-oldGold' : 'bg-gray-400'}`}>
                        {member.rank === 1 ? <Crown size={14} fill="white" /> : `#${member.rank}`}
                    </div>
                </div>
            )}

            <div className="flex items-start gap-4 mb-4">
                <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm shrink-0"
                    style={{ backgroundColor: member.avatarColor }}
                >
                    {member.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className={`font-bold truncate ${isCurrentUser ? 'text-teal' : 'text-charcoal'}`}>
                            {member.name} {isCurrentUser && "(Eu)"}
                        </h3>
                        {!isCurrentUser && (
                            <button 
                                onClick={onLike}
                                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full transition-colors ${member.isLikedByCurrentUser ? 'bg-coral/10 text-coral' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            >
                                <Heart size={12} fill={member.isLikedByCurrentUser ? "currentColor" : "none"} />
                                {member.likesReceived}
                            </button>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Membro Ativo</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <Send size={12} />
                        <span className="text-[10px] font-bold uppercase">Enviados</span>
                    </div>
                    <span className="text-lg font-serif font-bold text-teal">{member.incentivesSent}</span>
                </div>
                <div className="text-center border-l border-gray-100">
                     <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <Book size={12} />
                        <span className="text-[10px] font-bold uppercase">Livros</span>
                    </div>
                    <span className="text-lg font-serif font-bold text-charcoal">{member.booksRead}</span>
                </div>
                <div className="text-center border-l border-gray-100">
                     <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <AlignLeft size={12} />
                        <span className="text-[10px] font-bold uppercase">Vers/Dia</span>
                    </div>
                    <span className="text-lg font-serif font-bold text-charcoal">{member.versesPerDay}</span>
                </div>
            </div>
        </motion.div>
    );
};

const SkeletonCommunity = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 h-40 animate-pulse">
                <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2 py-1">
                        <div className="w-1/2 h-4 bg-gray-200 rounded" />
                        <div className="w-1/4 h-3 bg-gray-200 rounded" />
                    </div>
                </div>
                <div className="h-16 bg-gray-50 rounded-lg" />
            </div>
        ))}
    </div>
);
