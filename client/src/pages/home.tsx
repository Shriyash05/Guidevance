import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Leaf, LeafyGreen, Flower } from "lucide-react";
import { generateRoadmapSchema, type GenerateRoadmapRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface GenerateRoadmapResponse {
  success: boolean;
  roadmapId: string;
}

export default function Home() {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<GenerateRoadmapRequest>({
    resolver: zodResolver(generateRoadmapSchema),
    defaultValues: {
      field: "",
      level: "Basic"
    }
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateRoadmapRequest) => {
      return await apiRequest<GenerateRoadmapResponse>("POST", "/api/generate-roadmap", data);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      if (data && data.roadmapId) {
        toast.success("Roadmap generated successfully!");
        navigate(`/roadmap/${data.roadmapId}`);
      } else {
        toast.error("Failed to generate roadmap");
      }
      setIsLoading(false);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
      setIsLoading(false);
    }
  });

  const onSubmit = (data: GenerateRoadmapRequest) => {
    generateMutation.mutate(data);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block relative mb-2">
            <h1 className="text-gradient text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text">
              Generate Your Learning Roadmap
            </h1>
            <span className="absolute -bottom-10 left-8 text-3xl animate-bounce-slow" style={{ animationDelay: '1s' }}>🚀</span>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4">
            Use AI to create a personalized learning path for any field of study at your preferred expertise level.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-500 mb-4">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 mr-1"></span>
              <span>Beginner-friendly</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-1"></span>
              <span>AI-powered</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-purple-400 mr-1"></span>
              <span>Personalized</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="max-w-md mx-auto text-center">
            <Card className="p-8 border-primary/30 shadow-lg shadow-primary/10">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-vibrant flex items-center justify-center mb-6 p-1 shadow-lg">
                  <div className="bg-white dark:bg-slate-900 w-full h-full rounded-full flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gradient mb-2">Generating Your Roadmap</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Our AI is crafting a personalized learning path for you. This may take a minute...</p>
                
                <div className="progress-bar w-full mb-6">
                  <div className="progress-bar-fill animate-progress"></div>
                </div>
                
                <div className="flex space-x-2 items-center mb-4">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                
                <div className="text-sm text-slate-500 dark:text-slate-400 italic text-center">
                  <span className="block mb-2">🧠 Analyzing learning patterns...</span>
                  <span className="block">📚 Building curriculum structure...</span>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <>
            <Card className="p-6 md:p-8 mb-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-primary/5 dark:shadow-primary/10 rounded-2xl relative overflow-hidden card-fun-hover">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-fun opacity-10 rounded-full -mt-10 -mr-10 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-cool opacity-10 rounded-full -mb-8 -ml-8 blur-xl"></div>
              <CardContent className="p-0 pt-6 relative">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Field Input */}
                    <FormField
                      control={form.control}
                      name="field"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Field of Study</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                placeholder="e.g. Machine Learning, Web Development, Data Science"
                                className="w-full px-4 py-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/30 shadow-sm dark:bg-slate-800 dark:text-slate-100 transition-all duration-200 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                {...field}
                              />
                              <div className="absolute inset-0 rounded-xl bg-gradient-vibrant opacity-0 group-hover:opacity-5 group-focus-within:opacity-10 pointer-events-none transition-opacity duration-300"></div>
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl opacity-70">🔍</div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Level Selection */}
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Learning Level</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="relative">
                              <input 
                                type="radio" 
                                id="level-basic" 
                                value="Basic"
                                checked={field.value === "Basic"}
                                onChange={() => form.setValue("level", "Basic")}
                                className="peer sr-only" 
                              />
                              <label 
                                htmlFor="level-basic" 
                                className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/10 transition-all duration-200"
                              >
                                <Leaf className="h-6 w-6 mb-2 text-emerald-500" />
                                <span className="font-medium dark:text-slate-200">Basic</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fundamentals & core concepts</span>
                              </label>
                            </div>
                            
                            <div className="relative">
                              <input 
                                type="radio" 
                                id="level-intermediate" 
                                value="Intermediate"
                                checked={field.value === "Intermediate"}
                                onChange={() => form.setValue("level", "Intermediate")}
                                className="peer sr-only" 
                              />
                              <label 
                                htmlFor="level-intermediate" 
                                className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/10 transition-all duration-200"
                              >
                                <LeafyGreen className="h-6 w-6 mb-2 text-blue-500" />
                                <span className="font-medium dark:text-slate-200">Intermediate</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Advanced topics & skills</span>
                              </label>
                            </div>
                            
                            <div className="relative">
                              <input 
                                type="radio" 
                                id="level-advanced" 
                                value="Advanced"
                                checked={field.value === "Advanced"}
                                onChange={() => form.setValue("level", "Advanced")}
                                className="peer sr-only" 
                              />
                              <label 
                                htmlFor="level-advanced" 
                                className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/10 transition-all duration-200"
                              >
                                <Flower className="h-6 w-6 mb-2 text-purple-500" />
                                <span className="font-medium dark:text-slate-200">Advanced</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Expert knowledge & mastery</span>
                              </label>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Generate Button */}
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        size="lg"
                        className="w-full bg-gradient-vibrant hover:bg-gradient-fun text-white font-medium rounded-xl shadow-lg shadow-purple-500/20 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/30 btn-fun py-6"
                        disabled={generateMutation.isPending}
                      >
                        <span className="flex items-center justify-center text-lg">
                          {generateMutation.isPending ? (
                            <>
                              <div className="w-6 h-6 mr-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                              <span className="font-bold">Creating Your Roadmap...</span>
                            </>
                          ) : (
                            <>
                              <span className="mr-2 text-xl">✨</span>
                              <span className="font-bold">Generate Learning Roadmap</span>
                              <span className="ml-2 text-xl">🚀</span>
                            </>
                          )}
                        </span>
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 card-fun-hover border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-fun opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white mb-5 shadow-md shadow-pink-500/20 transform group-hover:rotate-3 transition-all duration-300">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 4.45962C9.91153 4.16968 10.9104 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.81988 22 10.3777 22 12C22 13.6223 21.575 14.1801 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957C2.42496 14.1801 2 13.6223 2 12C2 10.3777 2.42496 9.81988 3.27489 8.70433C3.75612 8.07914 4.32973 7.43025 5 6.82137" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5"></path>
                  </svg>
                </div>
                <div className="relative">
                  <h3 className="text-gradient from-pink-500 to-fuchsia-500 text-xl font-bold mb-2">AI-Powered</h3>
                  <p className="text-slate-600 dark:text-slate-400">Intelligent learning paths customized to your specific needs and preferences.</p>
                  <span className="absolute -top-4 -right-2 text-xl opacity-75">🧠</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 card-fun-hover border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-cool opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white mb-5 shadow-md shadow-blue-500/20 transform group-hover:rotate-3 transition-all duration-300">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 14V7C20 5.34315 18.6569 4 17 4H7C5.34315 4 4 5.34315 4 7V17C4 18.6569 5.34315 20 7 20H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path d="M12 12H8M12 8H8M12 16H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path d="M16 20L18.5 17.5M21 20L18.5 17.5M18.5 17.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <div className="relative">
                  <h3 className="text-gradient from-blue-500 to-cyan-400 text-xl font-bold mb-2">Structured Content</h3>
                  <p className="text-slate-600 dark:text-slate-400">Well-organized roadmaps with clear learning steps and progression tracking.</p>
                  <span className="absolute -top-4 -right-2 text-xl opacity-75">📚</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 card-fun-hover border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-vibrant opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white mb-5 shadow-md shadow-violet-500/20 transform group-hover:rotate-3 transition-all duration-300">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 21V16.5M4 16.5C6.5 16.5 11.5 15 11.5 8.5C11.5 8.5 9.5 8.5 8 8.5C6.5 8.5 4 9 4 16.5ZM8 8.5V3M8 3H6.5M8 3H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M13 21L13 11M13 11C15.5 11 20 10 20 3C20 3 17.5 3 16 3C14.5 3 13 3.5 13 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <div className="relative">
                  <h3 className="text-gradient from-violet-500 to-purple-500 text-xl font-bold mb-2">Multiple Levels</h3>
                  <p className="text-slate-600 dark:text-slate-400">Choose Basic, Intermediate, or Advanced based on your experience level.</p>
                  <span className="absolute -top-4 -right-2 text-xl opacity-75">🚀</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
