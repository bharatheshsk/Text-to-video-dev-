
import { GoogleGenAI, Type } from "@google/genai";
import type { Scene } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const sceneSplitterSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            scene: {
                type: Type.STRING,
                description: 'A short sentence or phrase describing a single, continuous action or moment.'
            },
        },
        required: ['scene'],
    },
};

export const splitTextIntoScenes = async (script: string): Promise<Scene[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following script and break it down into logical, short scenes suitable for video generation. Each scene should ideally be a single, concise descriptive sentence or phrase, maximum 15 words. Provide the output as a JSON array of objects. Script: "${script}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: sceneSplitterSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const scenes = JSON.parse(jsonText) as Scene[];
        return scenes;
    } catch (error: any) {
        console.error("Error splitting text into scenes:", error);
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : String(error);
        if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota exceeded')) {
            throw new Error("Script analysis failed: API quota exceeded. Please check your Google AI Studio account for details.");
        }
        throw new Error("Failed to analyze the script. Please try again with a different text.");
    }
};

const pollVideoOperation = async (operation: any): Promise<string> => {
    let currentOperation = operation;
    while (!currentOperation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        try {
            currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
        } catch (error: any) {
            console.error("Error polling video operation:", error);
            const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : String(error);
            if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota exceeded')) {
                throw new Error("Video generation failed: API quota exceeded. Please check your Google AI Studio account for details.");
            }
            throw new Error("Failed while checking video generation status.");
        }
    }

    const downloadLink = currentOperation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }

    const response = await fetch(`${downloadLink}&key=${API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch the generated video. Status: ${response.status}`);
    }
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};

export const generateVideoForScene = async (prompt: string): Promise<string> => {
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
            },
        });
        
        return await pollVideoOperation(operation);
    } catch (error: any) {
        console.error("Error generating video for scene:", error);
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : String(error);
        if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota exceeded')) {
            throw new Error("Video generation failed: API quota exceeded. Please check your Google AI Studio account for details.");
        }
        throw new Error(`Failed to generate video for prompt: "${prompt}"`);
    }
};
