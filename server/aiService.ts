import { GoogleGenerativeAI } from "@google/generative-ai";
import { Section, Roadmap } from "@shared/schema";
import dotenv from "dotenv";

dotenv.config();

// Initialize Google Generative AI with the API key
const API_KEY = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generates a learning roadmap using Google's Generative AI
 * @param field The field of study
 * @param level The learning level (Basic, Intermediate, Advanced)
 * @returns A roadmap object with sections, steps, and topics
 */
export async function generateAIRoadmap(field: string, level: string): Promise<Roadmap> {
  try {
    if (!API_KEY) {
      throw new Error("Google API Key not found in environment variables");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let levelPrompt = '';
    
    if (level === 'Basic') {
      levelPrompt = 'Focus only on foundational concepts, starting from the very beginning.';
    } else if (level === 'Intermediate') {
      levelPrompt = 'Start with basic foundational concepts and progress to intermediate concepts. The first 30-40% should be basic level content before advancing to intermediate topics.';
    } else if (level === 'Advanced') {
      levelPrompt = 'Create a comprehensive progression starting with basic concepts (20%), followed by intermediate concepts (30%), and then advanced topics (50%). The roadmap should build progressively from fundamentals to expert-level material.';
    }
    
    const prompt = `
    Create a detailed learning roadmap for ${field} that progressively builds knowledge from the beginning to ${level} level.
    
    Format the response as a structured JSON object with the following format:
    {
      "roadmap": [
        {
          "title": "Section Title",
          "steps": [
            {
              "title": "Step Title",
              "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"]
            }
          ]
        }
      ]
    }
    
    Include 3-5 sections, each with 2-3 steps, and each step with 3-6 topics.
    Make sure the content is accurate, comprehensive, and follows a logical learning progression.
    
    ${levelPrompt}
    
    Ensure section titles clearly indicate the progression level (e.g., "Fundamental Concepts", "Building Intermediate Skills", "Advanced Techniques").
    
    Return ONLY the JSON, without markdown formatting or additional text.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response");
    }
    
    const jsonResponse = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (!jsonResponse.roadmap || !Array.isArray(jsonResponse.roadmap)) {
      throw new Error("Invalid roadmap structure in AI response");
    }
    
    // Construct and return the roadmap
    return {
      fieldOfStudy: field,
      level: level as "Basic" | "Intermediate" | "Advanced",
      roadmap: jsonResponse.roadmap as Section[]
    };
  } catch (error: any) {
    console.error("Error generating AI roadmap:", error.message);
    throw new Error(`Failed to generate roadmap: ${error.message}`);
  }
}
