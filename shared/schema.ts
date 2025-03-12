import { z } from "zod";

// Roadmap Types
export const topicSchema = z.array(z.string());

export const stepSchema = z.object({
  title: z.string(),
  topics: topicSchema
});

export const sectionSchema = z.object({
  title: z.string(),
  steps: z.array(stepSchema)
});

export const roadmapSchema = z.object({
  fieldOfStudy: z.string(),
  level: z.enum(["Basic", "Intermediate", "Advanced"]),
  roadmap: z.array(sectionSchema)
});

export const generateRoadmapSchema = z.object({
  field: z.string().min(1, "Field is required"),
  level: z.enum(["Basic", "Intermediate", "Advanced"])
});

export type Topic = z.infer<typeof topicSchema>;
export type Step = z.infer<typeof stepSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Roadmap = z.infer<typeof roadmapSchema>;
export type GenerateRoadmapRequest = z.infer<typeof generateRoadmapSchema>;
