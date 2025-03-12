import { GoogleGenerativeAI } from "@google/generative-ai";
import { roadmapSchema, type Roadmap, type Section } from "../shared/schema";
import { ZodError } from "zod";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const apikey = process.env.GOOGLE_API_KEY || "";
if (!apikey) {
  throw new Error("GOOGLE_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(apikey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateAIRoadmap(
  fieldOfStudy: string,
  level: "Basic" | "Intermediate" | "Advanced"
): Promise<Roadmap> {
  try {
    const prompt = `
      Generate a learning roadmap for ${level} level in ${fieldOfStudy}.
      Response format: JSON with this structure:
      {
        "fieldOfStudy": "${fieldOfStudy}",
        "level": "${level}",
        "roadmap": [
          {
            "title": "Section Title",
            "steps": [
              {
                "title": "Step Title",
                "topics": ["Topic 1", "Topic 2"]
              }
            ]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanText = text.replace(/```json|```/g, "").trim();

    try {
      const currentLevelData = JSON.parse(cleanText) as Roadmap;
      let finalRoadmap: Section[] = [];

      // For intermediate level, add basic content first
      if (level === "Intermediate" || level === "Advanced") {
        console.log("Generating Basic level content...");
        const basicData = await generateAIRoadmap(fieldOfStudy, "Basic");
        finalRoadmap = [...basicData.roadmap];

        if (level === "Advanced") {
          console.log("Generating Intermediate level content...");
          const intermediateData = await generateAIRoadmap(fieldOfStudy, "Intermediate");
          const intermediateContent = intermediateData.roadmap.slice(basicData.roadmap.length);
          finalRoadmap = [...finalRoadmap, ...intermediateContent];
        }
      }

      // Add current level content
      finalRoadmap = [...finalRoadmap, ...currentLevelData.roadmap];

      // Validate the roadmap structure
      const validatedRoadmap = roadmapSchema.parse({
        fieldOfStudy,
        level,
        roadmap: finalRoadmap
      });

      return validatedRoadmap;
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Schema validation failed:", error.errors);
        throw new Error("Invalid roadmap structure returned by AI");
      }
      if (error instanceof SyntaxError) {
        console.error("JSON parsing failed:", error);
        throw new Error("Invalid JSON returned by AI");
      }
      throw error;
    }
  } catch (error) {
    console.error("❌ AI API Error:", error);
    throw new Error("Failed to generate roadmap");
  }
}