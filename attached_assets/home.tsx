import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Loader2 } from "lucide-react";
import { generateRoadmapSchema, type GenerateRoadmapRequest } from "../../shared/schema";
import { apiRequest } from "../lib/queryClient";

// Define the expected response type for roadmap generation
interface GenerateRoadmapResponse {
  roadmapId: string;
}

export default function Home() {
  const navigate = useLocation()[1];
  const { toast } = useToast();

  const form = useForm<GenerateRoadmapRequest>({
    resolver: zodResolver(generateRoadmapSchema),
    defaultValues: { field: "", level: "Basic" },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateRoadmapRequest): Promise<GenerateRoadmapResponse> => {
      return await apiRequest<GenerateRoadmapResponse>("POST", "/api/generate-roadmap", data);
    },
    onSuccess: (data) => {
      if (data?.roadmapId) {
        navigate(`/roadmap/${data.roadmapId}`);
      } else {
        toast("Unexpected error: Roadmap ID missing.");
      }
    },
    onError: () => {
      toast("Failed to generate roadmap");
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Learning Roadmap Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => generateMutation.mutate(data))} className="space-y-6">
              {/* Field of Study Input */}
              <FormField control={form.control} name="field" render={({ field }) => (
                <FormItem>
                  <FormLabel>Field of Study</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Data Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Learning Level Select */}
              <FormField control={form.control} name="level" render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={generateMutation.isPending}>
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  "Generate Roadmap"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
