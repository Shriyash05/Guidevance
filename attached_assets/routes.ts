import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Roadmap } from './models/roadmap';
import { generateAIRoadmap } from './aiservices';

const router = express.Router();

interface GenerateRoadmapRequestBody {
  field: string;
  level: "Basic" | "Intermediate" | "Advanced";
}

// ✅ POST: Generate & Store Roadmap
router.post('/api/generate-roadmap', async (req: Request, res: Response): Promise<any> => {
  try {
    const { field, level } = req.body as GenerateRoadmapRequestBody;

    // 🔹 Validate Inputs
    if (!field || !level) {
      return res.status(400).json({ error: "Missing field or level" });
    }
    if (!["Basic", "Intermediate", "Advanced"].includes(level)) {
      return res.status(400).json({ error: "Invalid level. Allowed values: Basic, Intermediate, Advanced." });
    }

    // 🔥 Generate Roadmap using AI Service
    const roadmapData = await generateAIRoadmap(field, level);
    if (!roadmapData || !Array.isArray(roadmapData.roadmap) || roadmapData.roadmap.length === 0) {
      throw new Error("Failed to generate roadmap");
    }

    // ✅ Save to MongoDB
    const newRoadmap = new Roadmap({ fieldOfStudy: field, level, roadmap: roadmapData.roadmap });
    await newRoadmap.save();

    return res.json({ success: true, roadmapId: newRoadmap._id });
  } catch (error: any) {
    console.error("❌ Error generating roadmap:", error.message);
    return res.status(500).json({ error: error.message || "Failed to generate roadmap" });
  }
});

// ✅ GET: Retrieve Roadmap by ID
router.get('/api/get-roadmap/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // 🔹 Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid roadmap ID" });
    }

    const roadmap = await Roadmap.findById(id);
    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    return res.json(roadmap);
  } catch (error) {
    console.error("❌ Error fetching roadmap:", error);
    return res.status(500).json({ error: "Failed to fetch roadmap" });
  }
});

export default router;
