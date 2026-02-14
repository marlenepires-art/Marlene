
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuestion = async (topic: string, difficulty: string): Promise<Question> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gera uma pergunta de gramática para alunos do 2.º ciclo do ensino básico em Portugal (5.º e 6.º anos). 
    Tópico: "${topic}". 
    Nível de dificuldade: ${difficulty}. 
    REGRAS CRÍTICAS: 
    1. Usa EXCLUSIVAMENTE o Português de Portugal (variante europeia). 
    2. Utiliza a terminologia gramatical em vigor em Portugal (Dicionário Terminológico). 
    3. O tom deve ser lúdico, pedagógico e motivador.
    4. Inclui uma "pista" (hint) curta que ajude o aluno sem dar a resposta diretamente.
    5. Evita termos como "caderno", "professor", "aula" se não forem estritamente necessários para o exercício.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 4,
            maxItems: 4
          },
          correctAnswerIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
          hint: { type: Type.STRING },
          difficulty: { type: Type.STRING }
        },
        required: ["question", "options", "correctAnswerIndex", "explanation", "hint", "difficulty"]
      }
    }
  });

  const questionData = JSON.parse(response.text.trim());
  return {
    ...questionData,
    id: Math.random().toString(36).substr(2, 9),
    topic
  };
};

export const getTrophyMessage = async (score: number, total: number): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Cria uma mensagem curta de incentivo em Português de Portugal para um aluno que acertou ${score} de ${total} perguntas de gramática. Usa um tom de celebração e emojis.`
  });
  return response.text.trim();
};

export const generateTTS = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Lê com entusiasmo em Português de Portugal: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (e) {
    console.error("Erro no TTS", e);
    return undefined;
  }
};
