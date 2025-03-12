import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  type: [String]
});

const StepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topics: { type: [String], required: true }
});

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  steps: { type: [StepSchema], required: true }
});

const RoadmapSchema = new mongoose.Schema({
  fieldOfStudy: { type: String, required: true },
  level: { 
    type: String, 
    enum: ["Basic", "Intermediate", "Advanced"], 
    required: true 
  },
  roadmap: { type: [SectionSchema], required: true }
}, { timestamps: true });

export const Roadmap = mongoose.model("Roadmap", RoadmapSchema);
