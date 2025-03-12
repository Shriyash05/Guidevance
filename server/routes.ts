import express, { type Express } from "express";
import { createServer, type Server } from "http";
import mongoose from "mongoose";
import { generateRoadmapSchema } from "@shared/schema";
import { connectDB } from "./db";
import { Roadmap } from "./models/roadmap";
import { generateAIRoadmap } from "./aiService";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Connect to MongoDB
  await connectDB();

  // POST: Generate & Store Roadmap
  app.post('/api/generate-roadmap', async (req, res) => {
    try {
      const result = generateRoadmapSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: result.error.errors 
        });
      }
      
      const { field, level } = result.data;
      
      // Generate Roadmap using AI
      const roadmapData = await generateAIRoadmap(field, level);
      if (!roadmapData || !Array.isArray(roadmapData.roadmap) || roadmapData.roadmap.length === 0) {
        throw new Error("Failed to generate roadmap");
      }
      
      // Save to MongoDB
      const newRoadmap = new Roadmap({
        fieldOfStudy: field,
        level,
        roadmap: roadmapData.roadmap
      });
      
      await newRoadmap.save();
      
      return res.json({ 
        success: true, 
        roadmapId: newRoadmap._id 
      });
    } catch (error: any) {
      console.error("Error generating roadmap:", error.message);
      return res.status(500).json({ 
        error: error.message || "Failed to generate roadmap" 
      });
    }
  });

  // GET: Retrieve Roadmap by ID
  app.get('/api/roadmap/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid roadmap ID" });
      }
      
      const roadmap = await Roadmap.findById(id);
      if (!roadmap) {
        return res.status(404).json({ error: "Roadmap not found" });
      }
      
      return res.json(roadmap);
    } catch (error: any) {
      console.error("Error fetching roadmap:", error);
      return res.status(500).json({ error: "Failed to fetch roadmap" });
    }
  });

  return httpServer;
}
