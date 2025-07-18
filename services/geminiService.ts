

import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const getApiKey = (): string => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set.");
    }
    return apiKey;
};

export const getPersonalizedGoal = async (weight: number, age: number, gender: string): Promise<number> => {
    try {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        const prompt = `Based on a person who is ${age} years old, weighs ${weight} kg, and identifies as ${gender}, calculate a recommended daily water intake in milliliters (ml). The calculation should be based on general health guidelines for a person with a sedentary to light activity level. The final recommendation should be a single integer.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendedIntakeML: {
                            type: Type.INTEGER,
                            description: 'The recommended daily water intake in milliliters, rounded to the nearest 50.',
                        },
                    },
                    required: ['recommendedIntakeML'],
                },
                temperature: 0.2,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (typeof result.recommendedIntakeML === 'number') {
            // Round to nearest 50 for a cleaner goal number
            return Math.round(result.recommendedIntakeML / 50) * 50;
        } else {
            throw new Error("Invalid response format from API.");
        }

    } catch (error) {
        console.error("Error fetching personalized goal from Gemini API:", error);
        if (error instanceof Error && error.message.includes("API_KEY")) {
            throw new Error("Gemini API key is not configured or invalid.");
        }
        throw new Error("Failed to calculate personalized goal.");
    }
};


export const getHydrationFact = async (): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Tell me a surprising and short fact about hydration or drinking water. Keep it to one or two sentences.",
      config: {
        temperature: 1, // Be creative
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 0 } // faster response
      }
    });
    
    const text = response.text;

    if (!text) {
        throw new Error("Received an empty response from the API.");
    }

    return text.trim();

  } catch (error) {
    console.error("Error fetching hydration fact from Gemini API:", error);
    if (error instanceof Error && error.message.includes("API_KEY")) {
        throw new Error("Gemini API key is not configured or invalid.");
    }
    throw new Error("Failed to get a hydration fact.");
  }
};

export const getMotivationalCompliment = async (): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const prompt = `Generate a short, powerful, and motivational compliment for a girl or woman, celebrating her drive and progress towards her goals. The tone should be inspiring, affirming, and concise (1-2 sentences). Examples: "Your dedication is building an empire of your own making. Keep shining!", "You're turning dreams into plans and plans into reality. Absolutely brilliant!". Do not use quotes in the response.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 0 } // faster response
      }
    });
    
    const text = response.text;

    if (!text) {
        // Fallback compliment
        return "You're doing amazing! Keep it up!";
    }

    return text.trim();

  } catch (error) {
    console.error("Error fetching motivational compliment from Gemini API:", error);
    // Return a default compliment on error
    return "You're doing great! Every step counts.";
  }
};