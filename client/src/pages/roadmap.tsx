import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ArrowLeft, 
  Download, 
  Share2, 
  FileImage, 
  FileText, 
  FileJson 
} from "lucide-react";
import RoadmapSection from "@/components/ui/roadmap-section";
import { Roadmap } from "@shared/schema";
import { RoadmapParams } from "@/lib/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function RoadmapPage() {
  const { roadmapId } = useParams<RoadmapParams>();
  const [, navigate] = useLocation();
  const roadmapRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: roadmap, isLoading, error } = useQuery<Roadmap>({
    queryKey: ['/api/roadmap', roadmapId],
    enabled: !!roadmapId,
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load roadmap");
      console.error("Error fetching roadmap:", error);
    }
  }, [error]);

  const handleDownloadAsImage = async () => {
    if (!roadmapRef.current) return;
    
    try {
      setIsDownloading(true);
      toast.info("Preparing JPG download...");
      
      const content = roadmapRef.current;
      const canvas = await html2canvas(content, { 
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        useCORS: true
      });
      
      const imageData = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `${roadmap?.fieldOfStudy}-${roadmap?.level}-roadmap.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("JPG downloaded successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to download as JPG");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleDownloadAsPDF = async () => {
    if (!roadmapRef.current) return;
    
    try {
      setIsDownloading(true);
      toast.info("Preparing PDF download...");
      
      const content = roadmapRef.current;
      const canvas = await html2canvas(content, { 
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        useCORS: true
      });
      
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      
      // A4 size in points
      const pdf = new jsPDF({
        orientation: contentHeight > contentWidth ? 'portrait' : 'landscape',
        unit: 'pt',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate scaling to fit content to page
      const scale = Math.min(pdfWidth / contentWidth, pdfHeight / contentHeight);
      const scaledWidth = contentWidth * scale;
      const scaledHeight = contentHeight * scale;
      
      // Center content on page
      const x = (pdfWidth - scaledWidth) / 2;
      const y = (pdfHeight - scaledHeight) / 2;
      
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        x,
        y,
        scaledWidth,
        scaledHeight
      );
      
      pdf.save(`${roadmap?.fieldOfStudy}-${roadmap?.level}-roadmap.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download as PDF");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleDownloadAsJSON = () => {
    try {
      const json = JSON.stringify(roadmap, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `${roadmap?.fieldOfStudy}-${roadmap?.level}-roadmap.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      toast.success("JSON downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download as JSON");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${roadmap?.fieldOfStudy} Learning Roadmap`,
        text: `Check out this learning roadmap for ${roadmap?.fieldOfStudy} at ${roadmap?.level} level.`,
        url: window.location.href,
      }).catch(err => {
        toast.error("Error sharing: " + err.message);
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin mb-4" />
          <p className="text-slate-600">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <svg className="h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-900 mb-1">No Roadmap Found</h3>
              <p className="text-slate-600 mb-6">The roadmap you're looking for might have been removed or doesn't exist.</p>
              <Button onClick={() => navigate("/")} variant="outline">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <Button 
              variant="ghost" 
              className="flex items-center text-slate-600 hover:text-slate-900 mb-2"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Generator
            </Button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{roadmap.fieldOfStudy} - {roadmap.level}</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleDownloadAsImage}
              disabled={isDownloading}
            >
              <FileImage className="h-4 w-4" />
              <span className="text-sm">JPG</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleDownloadAsPDF}
              disabled={isDownloading}
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm">PDF</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleDownloadAsJSON}
              disabled={isDownloading}
            >
              <FileJson className="h-4 w-4" />
              <span className="text-sm">JSON</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6" ref={roadmapRef}>
            <div className="space-y-8">
              {roadmap.roadmap.map((section, sectionIndex) => (
                <RoadmapSection 
                  key={sectionIndex}
                  section={section}
                  sectionIndex={sectionIndex}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
