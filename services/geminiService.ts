
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAccountingTip = async (topic: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("La función de consejos de IA está desactivada. Por favor, configure una API_KEY.");
  }

  const prompt = `Eres un asistente de contabilidad experto. Explica el siguiente concepto contable de forma sencilla y amigable para el dueño de una nueva marca de ropa que no tiene experiencia en contabilidad. Concéntrate en por qué es importante para su negocio. El concepto es: '${topic}'. Limita la respuesta a dos párrafos cortos y útiles. Usa español. No uses formato markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching accounting tip from Gemini:", error);
    return "Hubo un error al generar el consejo. Por favor, inténtalo de nuevo más tarde.";
  }
};
