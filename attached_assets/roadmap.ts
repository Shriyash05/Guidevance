import mongoose from "mongoose";

const RoadmapSchema = new mongoose.Schema({
  fieldOfStudy: { type: String, required: true },
  level: { type: String, enum: ["Basic", "Intermediate", "Advanced"], required: true },
  roadmap: { type: Object, required: true },
}, { timestamps: true });

export const Roadmap = mongoose.model("Roadmap", RoadmapSchema);
