import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { apiRequest } from "../lib/queryClient";
import type { Roadmap } from "../../shared/schema";

export default function RoadmapPage() {
  const { roadmapId } = useParams();
  const [, navigate] = useLocation();
  const [roadmapData, setRoadmapData] = useState<Roadmap | null>(null);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        console.log("Fetching roadmap for ID:", roadmapId);

        // Ensure correct typing
        const data = await apiRequest<Roadmap>("GET", `/api/get-roadmap/${roadmapId}`);

        console.log("✅ Roadmap Data:", data);
        setRoadmapData(data);
      } catch (error) {
        console.error("❌ Error fetching roadmap:", error);
        navigate("/");
      }
    }

    if (roadmapId) fetchRoadmap();
  }, [roadmapId, navigate]);

  if (!roadmapData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading roadmap...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" className="mb-6" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>
              {roadmapData ? `${roadmapData.fieldOfStudy} - ${roadmapData.level}` : "Roadmap"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {roadmapData ? (
              <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify(roadmapData.roadmap, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">No roadmap data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
