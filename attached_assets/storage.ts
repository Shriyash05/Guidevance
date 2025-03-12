const roadmapStore = new Map<string, any>(); // ✅ Simple in-memory storage

export function storeRoadmap(userId: string, roadmapData: any) {
  roadmapStore.set(userId, roadmapData);
}

export function getRoadmap(userId: string) {
  return roadmapStore.get(userId) || null;
}
