import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Leaderboard from "./pages/Leaderboard";
import BrowseDevelopers from "./pages/BrowseDevelopers";
import SavedDevelopers from "./pages/SavedDevelopers";
import TestSelection from "./pages/TestSelection";
import TakeTest from "./pages/TakeTest";
import TestResults from "./pages/TestResults";
import EmployerDashboard from "./pages/EmployerDashboard";
import TestingHub from "./pages/TestingHub";
import EmployerOnboarding from "./pages/EmployerOnboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/browse" element={<BrowseDevelopers />} />
          <Route path="/saved" element={<SavedDevelopers />} />
          <Route path="/test-candidate" element={<TestingHub />} />
          <Route path="/test-candidate/demo" element={<TestSelection />} />
          <Route path="/employer/onboarding" element={<EmployerOnboarding />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/test-candidate/:testId" element={<TakeTest />} />
          <Route path="/test-candidate/:testId/results" element={<TestResults />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
