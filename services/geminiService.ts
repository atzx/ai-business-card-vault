
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedCardData } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const extractInfoFromImage = async (imageFile: File): Promise<ExtractedCardData> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePart = await fileToGenerativePart(imageFile);

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                imagePart,
                { text: 'Extract the information from this business card. If a field is not present, leave it as an empty string.' }
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    company: { type: Type.STRING },
                    position: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    email: { type: Type.STRING },
                    website: { type: Type.STRING },
                    address: { type: Type.STRING },
                },
                required: ['name']
            }
        }
    });

    const responseText = result.text.trim();
    try {
        const parsedData = JSON.parse(responseText);
        return parsedData as ExtractedCardData;
    } catch (e) {
        console.error("Failed to parse JSON response:", responseText);
        throw new Error("AI returned an invalid format. Please try again.");
    }
};
