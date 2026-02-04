import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

// Auth pages
import SignIn from "./pages/SignIn";
import RoleSelection from "./pages/RoleSelection";
import FreelancerSignup from "./pages/FreelancerSignup";
import BusinessOwnerSignup from "./pages/BusinessOwnerSignup";
import VerifyEmail from "./pages/VerifyEmail";

// Employer pages
import EmployerDashboard from "./pages/EmployerDashboard";
import BrowseDevelopers from "./pages/BrowseDevelopers";
import SavedDevelopers from "./pages/SavedDevelopers";
import TestSelection from "./pages/TestSelection";
import TakeTest from "./pages/TakeTest";
import TestResults from "./pages/TestResults";
import TestingHub from "./pages/TestingHub";
import EmployerOnboarding from "./pages/EmployerOnboarding";
import CreateContract from "./pages/CreateContract";
import ContractDetails from "./pages/ContractDetails";

// Freelancer pages
import FreelancerDashboard from "./pages/FreelancerDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            {/* Auth routes */}
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<RoleSelection />} />
            <Route path="/auth/signup/freelancer" element={<FreelancerSignup />} />
            <Route path="/auth/signup/business" element={<BusinessOwnerSignup />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            
            {/* Employer routes (protected) */}
            <Route 
              path="/employer/dashboard" 
              element={
                <ProtectedRoute requiredRole="BusinessOwner">
                  <EmployerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employer/onboarding" 
              element={
                <ProtectedRoute requiredRole="BusinessOwner">
                  <EmployerOnboarding />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/browse" 
              element={
                <ProtectedRoute requiredRole="BusinessOwner">
                  <BrowseDevelopers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/saved" 
              element={
                <ProtectedRoute requiredRole="BusinessOwner">
                  <SavedDevelopers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test-candidate" 
              element={
                <ProtectedRoute requiredRole="BusinessOwner">
                  <TestingHub />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test-candidate/demo" 
              element={
                <ProtectedRoute requiredRole="BusinessOwner">
                  <TestSelection />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test-candidate/:testId" 
              element={
                <ProtectedRoute requiredRole="BusinessOwner">
                  <TakeTest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test-candidate/:testId/results" 
              element={
                <ProtectedRoute requiredRole="BusinessOwner">
                  <TestResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employer/contracts/new" 
              element={
                <ProtectedRoute requiredRole="BusinessOwner">
                  <CreateContract />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employer/contracts/:id" 
              element={
                <ProtectedRoute requiredRole="BusinessOwner">
                  <ContractDetails />
                </ProtectedRoute>
              } 
            />
            
            {/* Freelancer routes (protected) */}
            <Route 
              path="/freelancer/dashboard" 
              element={
                <ProtectedRoute requiredRole="Freelancer">
                  <FreelancerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/freelancer/contracts/:id" 
              element={
                <ProtectedRoute requiredRole="Freelancer">
                  <ContractDetails />
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
