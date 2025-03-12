import { Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner";
import Home from "./pages/home";
import Roadmap from "./pages/roadmap";
import NotFound from "./pages/not-found";
import NavBar from "./components/ui/nav-bar";
import Footer from "./components/ui/footer";

function Router() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/roadmap/:roadmapId" component={Roadmap} />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <NavBar />
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
