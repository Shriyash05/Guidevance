import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-8">
      <Card className="w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
              <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">404 Page Not Found</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
              The page you were looking for doesn't exist or has been moved.
            </p>
            <Button 
              variant="default" 
              onClick={() => navigate("/")}
              className="bg-gradient-vibrant hover:bg-gradient-fun text-white font-medium px-6 py-2 rounded-xl shadow-md shadow-purple-500/20 transform transition-all duration-300 hover:scale-[1.02]"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
