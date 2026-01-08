import React, { useState, useEffect, useRef } from 'react';
import { Lesson } from '../types';
import { ArrowLeft, Book, Mic, Square, Play, Info, Volume2, Wifi, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

interface SessionViewProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (audioBlob: Blob | null) => void;
}

export const SessionView: React.FC<SessionViewProps> = ({ lesson, onBack, onComplete }) => {
  const [step, setStep] = useState<'READING' | 'VIDEO' | 'INSIGHT'>('READING');
  
  return (
    <div className="pb-24">
      {/* Top Nav inside View */}
      <div className="mb-6 flex items-center gap-2 text-gray-400 hover:text-charcoal cursor-pointer" onClick={onBack}>
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Voltar para o Mapa</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 'READING' && (
             <ReadingStep key="reading" lesson={lesson} onNext={() => setStep('VIDEO')} />
        )}
        {step === 'VIDEO' && (
             <VideoStep key="video" lesson={lesson} onNext={() => setStep('INSIGHT')} />
        )}
        {step === 'INSIGHT' && (
             <InsightStep key="insight" lesson={lesson} onComplete={onComplete} />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-components for Steps ---

const ReadingStep: React.FC<{ lesson: Lesson; onNext: () => void }> = ({ lesson, onNext }) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div className="bg-[#F4F1EA] p-8 rounded-2xl border border-[#E8E1D0] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Book size={120} />
            </div>
            
            <span className="inline-block px-3 py-1 bg-charcoal text-white text-xs font-bold rounded-full mb-4">
                PASSO 1: LEITURA FÍSICA
            </span>
            
            <h2 className="font-serif text-3xl font-bold text-charcoal mb-2">Abra sua Bíblia</h2>
            
            <div className="my-6 py-6 border-t border-b border-charcoal/10">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Referência</p>
                        <p className="text-2xl font-serif text-teal font-bold">{lesson.reference}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Página</p>
                        <p className="text-2xl font-serif text-charcoal font-bold">{lesson.pageNumber}</p>
                    </div>
                </div>
            </div>

            <p className="text-gray-600 leading-relaxed font-sans mb-8">
                {lesson.description} Leia com atenção e observe os detalhes do texto.
            </p>

            <button 
                onClick={onNext}
                className="w-full bg-charcoal text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group"
            >
                Concluí a Leitura
                <div className="w-1.5 h-1.5 rounded-full bg-oldGold group-hover:scale-150 transition-transform" />
            </button>
        </div>
    </motion.div>
);

const VideoStep: React.FC<{ lesson: Lesson; onNext: () => void }> = ({ lesson, onNext }) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div className="bg-charcoal text-white p-6 rounded-2xl relative overflow-hidden aspect-video flex flex-col items-center justify-center group cursor-pointer shadow-xl">
            {/* Fake Video Player UI */}
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${lesson.videoUrl || 'https://picsum.photos/800/450'})` }}></div>
            <div className="absolute inset-0 bg-black/30" />
            
            <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center z-10 border border-white/20"
            >
                <Play size={24} fill="white" className="ml-1" />
            </motion.div>
            
            <div className="absolute bottom-4 left-4 z-10">
                <span className="text-xs font-bold bg-coral px-2 py-1 rounded">VÍDEO DE SÍNTESE</span>
                <p className="font-serif text-lg mt-2">{lesson.title}</p>
            </div>
             <div className="absolute bottom-4 right-4 z-10 text-xs font-mono opacity-80">
                {lesson.durationMinutes}:00
            </div>
        </div>

        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 text-orange-800 text-sm">
            <Info size={20} className="shrink-0" />
            <p>Assista ao vídeo para conectar o que você leu com o contexto histórico e teológico.</p>
        </div>

        <button 
            onClick={onNext}
            className="w-full bg-white border-2 border-charcoal text-charcoal py-4 rounded-xl font-medium hover:bg-gray-50 transition-all"
        >
            Prosseguir para Insight
        </button>
    </motion.div>
);

// --- Audio Helper Functions for Gemini Live API ---
function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
        let s = Math.max(-1, Math.min(1, float32Array[i]));
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

const InsightStep: React.FC<{ lesson: Lesson; onComplete: (blob: Blob | null) => void }> = ({ lesson, onComplete }) => {
    const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR'>('IDLE');
    const [isRecording, setIsRecording] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const videoRef = useRef<HTMLVideoElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const sessionRef = useRef<any>(null); // LiveSession type is complex, using any for brevity
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const initializedRef = useRef(false);

    // Initialize Audio Context
    const initAudioContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
    };

    const connectToGemini = async () => {
        setStatus('CONNECTING');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            // System instruction tailored to the lesson
            const systemInstruction = `Você é um mentor teológico sábio, amigável e encorajador. O aluno acabou de estudar a lição "${lesson.title}" baseada em ${lesson.reference}. Seu objetivo é ouvir o insight do aluno sobre o texto e fornecer um feedback construtivo, teológico e prático. Mantenha suas respostas curtas (máximo 45 segundos), calorosas e conversacionais. Não dê palestras longas. Faça perguntas instigantes se o insight for raso.`;

            // Establish Connection
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: systemInstruction,
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } // Kore is usually a good calm voice
                    }
                },
                callbacks: {
                    onopen: () => {
                        console.log("Gemini Live Connected");
                        setStatus('CONNECTED');
                        setIsRecording(true); // Auto-start recording when connected
                        startAudioInput(sessionPromise);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle Audio Output
                        const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (audioData) {
                            setIsAiSpeaking(true);
                            await playAudioChunk(audioData);
                        }
                        
                        // Handle Turn Complete (optional logic)
                        if (message.serverContent?.turnComplete) {
                           // AI finished generating this turn
                           setIsAiSpeaking(false);
                        }
                    },
                    onclose: () => {
                        console.log("Gemini Live Closed");
                        setStatus('IDLE');
                        setIsRecording(false);
                    },
                    onerror: (err) => {
                        console.error("Gemini Live Error", err);
                        setStatus('ERROR');
                        setErrorMsg("Erro na conexão. Tente novamente.");
                    }
                }
            });
            
            sessionRef.current = sessionPromise;

        } catch (error) {
            console.error(error);
            setStatus('ERROR');
            setErrorMsg("Falha ao iniciar sessão.");
        }
    };

    const startAudioInput = async (sessionPromise: Promise<any>) => {
        try {
            initAudioContext();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            // Create AudioContext for input (16kHz recommended for STT usually, but 16k-24k works)
            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = inputCtx.createMediaStreamSource(stream);
            
            // ScriptProcessor is deprecated but effective for simple PCM streaming in this context
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
                if (!isRecording) return; // Mute logic at processor level
                
                const inputData = e.inputBuffer.getChannelData(0);
                const pcm16 = floatTo16BitPCM(inputData);
                const base64Data = arrayBufferToBase64(pcm16);
                
                sessionPromise.then(session => {
                    session.sendRealtimeInput({
                        media: {
                            mimeType: 'audio/pcm;rate=16000',
                            data: base64Data
                        }
                    });
                });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
            
            sourceRef.current = source;
            processorRef.current = processor;
        } catch (err) {
            console.error("Microphone access denied", err);
            setErrorMsg("Acesso ao microfone negado.");
            setStatus('ERROR');
        }
    };

    const playAudioChunk = async (base64Audio: string) => {
        initAudioContext();
        if (!audioContextRef.current) return;
        
        const ctx = audioContextRef.current;
        const audioBytes = base64ToUint8Array(base64Audio);
        
        // Manual decoding for raw PCM from Gemini Live
        // Assuming 24kHz sample rate as configured in model output
        // Note: The model output is raw PCM, so we need to put it into a buffer manually
        
        // Helper to create audio buffer from PCM data
        const createAudioBuffer = (pcmData: Uint8Array, sampleRate: number): AudioBuffer => {
            const dataInt16 = new Int16Array(pcmData.buffer);
            const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
            const channelData = buffer.getChannelData(0);
            for (let i = 0; i < dataInt16.length; i++) {
                channelData[i] = dataInt16[i] / 32768.0;
            }
            return buffer;
        };

        const audioBuffer = createAudioBuffer(audioBytes, 24000);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        const currentTime = ctx.currentTime;
        // Schedule next chunk
        const startTime = Math.max(currentTime, nextStartTimeRef.current);
        source.start(startTime);
        nextStartTimeRef.current = startTime + audioBuffer.duration;
        
        sourcesRef.current.add(source);
        source.onended = () => {
             sourcesRef.current.delete(source);
             if (sourcesRef.current.size === 0) {
                 setIsAiSpeaking(false);
             }
        };
    };

    const stopSession = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current.onaudioprocess = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
        }
        // Ideally close session if the API supported a clean close method on the session object
        // sessionRef.current?.then(s => s.close?.());
        setStatus('IDLE');
        setIsRecording(false);
    };

    useEffect(() => {
        return () => {
            stopSession();
        };
    }, []);

    const toggleMute = () => {
        setIsRecording(!isRecording);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div>
                <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">Insight Interativo</h2>
                <p className="text-gray-600">Compartilhe o que você aprendeu. O Mentor IA está pronto para ouvir e conversar sobre o texto de hoje.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                
                {status === 'ERROR' && (
                    <div className="absolute top-4 inset-x-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                        {errorMsg}
                    </div>
                )}

                {status === 'IDLE' && (
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto">
                            <Wifi size={32} className="text-teal" />
                        </div>
                        <p className="text-gray-500 max-w-xs mx-auto">Conecte-se para iniciar uma conversa de voz em tempo real sobre a lição.</p>
                        <button 
                            onClick={connectToGemini}
                            className="bg-teal text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-teal/90 transition-all flex items-center gap-2 mx-auto"
                        >
                            <Mic size={18} />
                            Iniciar Conversa
                        </button>
                    </div>
                )}

                {(status === 'CONNECTING' || status === 'CONNECTED') && (
                    <div className="flex flex-col items-center w-full">
                        {/* Status Indicator */}
                        <div className="mb-8 flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${status === 'CONNECTED' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                             <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                                 {status === 'CONNECTING' ? 'CONECTANDO...' : 'MENTOR IA AO VIVO'}
                             </span>
                        </div>

                        {/* Visualization */}
                        <div className="h-32 flex items-center justify-center gap-1.5 w-full max-w-[200px] mb-8">
                            {/* Simple visualizer based on state */}
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`w-3 rounded-full ${isAiSpeaking ? 'bg-oldGold' : (isRecording ? 'bg-teal' : 'bg-gray-200')}`}
                                    animate={{
                                        height: (isAiSpeaking || isRecording) 
                                            ? [20, Math.random() * 80 + 20, 20] 
                                            : 20
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.5,
                                        delay: i * 0.1
                                    }}
                                />
                            ))}
                        </div>
                        
                        <div className="text-center mb-8 h-6">
                            {isAiSpeaking ? (
                                <p className="text-oldGold font-medium animate-pulse">O Mentor está falando...</p>
                            ) : isRecording ? (
                                <p className="text-teal font-medium animate-pulse">Ouvindo você...</p>
                            ) : (
                                <p className="text-gray-400">Microfone pausado</p>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={toggleMute}
                                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${isRecording ? 'border-teal text-teal bg-teal/10' : 'border-gray-300 text-gray-400'}`}
                                title={isRecording ? "Silenciar microfone" : "Ativar microfone"}
                            >
                                {isRecording ? <Mic size={24} /> : <MicOff size={24} />}
                            </button>

                            <button 
                                onClick={() => {
                                    stopSession();
                                    onComplete(null);
                                }}
                                className="px-6 py-3 bg-charcoal text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
                            >
                                Encerrar Sessão
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex justify-center">
                 <button onClick={() => onComplete(null)} className="text-xs text-gray-400 underline hover:text-gray-600">
                     Pular para conclusão
                 </button>
            </div>
        </motion.div>
    );
}