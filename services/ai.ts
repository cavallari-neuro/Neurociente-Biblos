import { Lesson } from "../types.ts";

// Note: Removed top-level import of @google/genai to prevent loading it 
// during the initial app bundle. We will load it dynamically.

export const generateInsightFeedback = async (lesson: Lesson): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key não encontrada. Retornando feedback simulado.");
    return "Não foi possível conectar à IA (Chave de API ausente). Mas parabéns por completar a leitura! A dedicação à palavra é o primeiro passo para a sabedoria.";
  }

  try {
    // Dynamic Import: Only download the library when this function is actually called.
    // This prevents the "infinite loading" on the splash screen if the CDN is slow.
    const { GoogleGenAI } = await import("@google/genai");
    
    const ai = new GoogleGenAI({ apiKey });
    
    // Using a reliable model for text generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Atue como um mentor teológico sábio, encorajador e breve.
        O aluno acabou de ler e refletir sobre: "${lesson.title}" (${lesson.reference}).
        Descrição da lição: "${lesson.description}".
        
        Gere um feedback curto (max 50 palavras) parabenizando o aluno e conectando o tema da lição com a vida prática dele hoje.
        Use um tom acolhedor, como um professor de escola dominical experiente.
      `,
    });

    return response.text || "Parabéns pela conclusão da lição!";
  } catch (error) {
    console.error("Erro na geração de IA:", error);
    return "Houve um erro ao gerar seu insight personalizado, mas sua jornada foi registrada com sucesso.";
  }
};