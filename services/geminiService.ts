
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function askLegalAssistant(prompt: string, history: any[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `You are an elite legal assistant specializing in East African law, with primary focus on Kenyan statutes (Constitution of Kenya, Companies Act, Employment Act, etc.). 
        Provide professional, accurate, and structured legal advice. Always cite relevant sections where possible. 
        If the user asks for drafting, provide high-quality legal templates customized for Kenyan jurisdiction.`,
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Legal Source',
      uri: chunk.web?.uri || '#'
    })) || [];

    return {
      text: response.text || "I'm sorry, I couldn't process that request.",
      sources
    };
  } catch (error) {
    console.error("Legal AI Error:", error);
    return { text: "Error connecting to legal database. Please check your connection.", sources: [] };
  }
}

export async function askLegalAssistantStream(prompt: string, onChunk: (text: string) => void, customInstruction?: string) {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: customInstruction || `You are an elite legal assistant specializing in East African law, with primary focus on Kenyan statutes (Constitution of Kenya, Companies Act, Employment Act, etc.). 
        Provide professional, accurate, and structured legal advice. Always cite relevant sections where possible. 
        If the user asks for drafting, provide high-quality legal templates customized for Kenyan jurisdiction.`,
        tools: [{ googleSearch: {} }]
      }
    });

    const result = await chat.sendMessageStream({ message: prompt });
    
    let fullText = "";
    for await (const chunk of result) {
      const chunkText = chunk.text || "";
      fullText += chunkText;
      onChunk(fullText);
    }

    return { text: fullText };
  } catch (error) {
    console.error("Legal AI Streaming Error:", error);
    throw error;
  }
}
export async function transcribeLegalAudio(base64Audio: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'audio/pcm;rate=16000', data: base64Audio } },
          { text: "Transcribe this legal dictation accurately. Return only the transcription text." }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Transcription Error:", error);
    return "";
  }
}
