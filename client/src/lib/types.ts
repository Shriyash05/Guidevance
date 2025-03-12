export interface RoadmapParams {
  roadmapId: string;
}

export interface RoadmapResponse {
  fieldOfStudy: string;
  level: string;
  roadmap: any; // Replace 'any' with a more specific type
}

export interface ErrorResponse {
  error: string;
}
