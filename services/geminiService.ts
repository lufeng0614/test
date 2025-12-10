import { GoogleGenAI, Type } from "@google/genai";
import { StandardType } from "../types";

// In a Vite environment, process.env.API_KEY is typically replaced at build time
// via the `define` configuration in vite.config.ts. 
// We access it directly to ensure compatibility with the build system and security guidelines.
const apiKey = process.env.API_KEY;

// 标准写法：使用 VITE_ 前缀和 import.meta.env
const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_API_KEY || '' 
});

/**
 * Gemini Service for Data Governance Platform
 * Provides AI capabilities to assist with standard document management.
 */
export const GeminiService = {
  /**
   * Analyzes a standard document name to automatically suggest its classification type.
   * Useful for enhancing the user experience by auto-filling the standard type in forms.
   * 
   * @param docName The name of the standard document (e.g., "GB/T 36073-2018")
   * @returns Predicted StandardType or null if the model cannot determine it
   */
  async suggestStandardType(docName: string): Promise<StandardType | null> {
    if (!docName) return null;

    try {
      const prompt = `Analyze the document title "${docName}" to determine its standard type context in China.
      
      Rules for classification:
      - "NATIONAL" (国标): Typically starts with GB, GB/T, GB/Z.
      - "INDUSTRY" (行标): Typically starts with industry codes like JR (Financial), DL (Power), YD (Telecom), GA (Public Security), etc.
      - "REGIONAL" (地标): Typically starts with DB followed by region code (e.g., DB31, DB11).
      
      Return a JSON object with a single field "type" having one of these exact values: "NATIONAL", "INDUSTRY", "REGIONAL", or "UNKNOWN".`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                enum: ['NATIONAL', 'INDUSTRY', 'REGIONAL', 'UNKNOWN']
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      switch (result.type) {
        case 'NATIONAL': return StandardType.NATIONAL;
        case 'INDUSTRY': return StandardType.INDUSTRY;
        case 'REGIONAL': return StandardType.REGIONAL;
        default: return null;
      }
    } catch (error) {
      console.error('Gemini Service: Error suggesting standard type:', error);
      return null;
    }
  },

  /**
   * Generates a brief, professional description for a standard document based on its title.
   * 
   * @param docName The name of the document
   * @returns A short description string
   */
  async generateDescription(docName: string): Promise<string> {
    if (!docName) return '';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide a professional, concise (1-2 sentences) description of what a Data Governance standard document named "${docName}" would likely cover. Focus on its utility for data architects.`,
      });
      return response.text || '';
    } catch (error) {
      console.error('Gemini Service: Error generating description:', error);
      return '';
    }
  }
};
