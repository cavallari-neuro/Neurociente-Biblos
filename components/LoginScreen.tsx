import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-gradient-to-b from-teal/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full z-10"
      >
        <div className="mb-10 text-center">
            <h2 className="font-serif text-4xl font-bold text-charcoal mb-3">Bem-vindo</h2>
            <p className="text-gray-500">Continue sua jornada de fé e conhecimento.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal transition-colors" size={20} />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-charcoal placeholder:text-gray-300 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Senha</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal transition-colors" size={20} />
                    <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-charcoal placeholder:text-gray-300 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button type="button" className="text-sm text-oldGold hover:text-bronze font-medium">
                    Esqueceu a senha?
                </button>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
                {loading ? 'Entrando...' : 'Entrar'}
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-oldGold" />}
            </button>
        </form>

        <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">Ainda não tem uma conta?</p>
            <button className="text-teal font-bold mt-1 hover:underline">Solicite acesso à sua escola/igreja</button>
        </div>
      </motion.div>

      <div className="py-6 text-center opacity-40">
        <p className="font-serif italic text-xs text-charcoal">"Lâmpada para os meus pés é a tua palavra"</p>
      </div>
    </div>
  );
};