import { Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner"; // Direct import
import Home from "./pages/home";
import Roadmap from "./pages/roadmap";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/roadmap" component={Roadmap} />
      <Route>{() => <NotFound />}</Route> {/* 404 Handling */}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
