import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ROUTES, USER_ROLES } from "@/config/constants";

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
import TestResultsList from "./pages/TestResultsList";
import TestingHub from "./pages/TestingHub";
import EmployerOnboarding from "./pages/EmployerOnboarding";
import EmployerGettingStarted from "./pages/EmployerGettingStarted";
import TestInvitations from "./pages/TestInvitations";
import CreateContract from "./pages/CreateContract";
import ContractDetails from "./pages/ContractDetails";

// Freelancer pages
import FreelancerDashboard from "./pages/FreelancerDashboard";
import CreateContractFreelancer from "./pages/CreateContractFreelancer";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path={ROUTES.HOME} element={<Index />} />
              <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
              
              {/* Auth routes */}
              <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
              <Route path={`${ROUTES.SIGN_IN}/*`} element={<SignIn />} />
              <Route path={ROUTES.SIGN_UP} element={<RoleSelection />} />
              <Route path={ROUTES.SIGN_UP_FREELANCER} element={<FreelancerSignup />} />
              <Route path={`${ROUTES.SIGN_UP_FREELANCER}/*`} element={<FreelancerSignup />} />
              <Route path={ROUTES.SIGN_UP_BUSINESS} element={<BusinessOwnerSignup />} />
              <Route path={`${ROUTES.SIGN_UP_BUSINESS}/*`} element={<BusinessOwnerSignup />} />
              <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
              <Route path={ROUTES.EMAIL_VERIFIED} element={<VerifyEmail />} />
              
              {/* Employer routes (protected) */}
              <Route 
                path={ROUTES.EMPLOYER_DASHBOARD}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.EMPLOYER_GETTING_STARTED}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <EmployerGettingStarted />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.EMPLOYER_ONBOARDING}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <EmployerOnboarding />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.BROWSE_DEVELOPERS}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <BrowseDevelopers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.SAVED_DEVELOPERS}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <SavedDevelopers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.TESTING_HUB}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <TestingHub />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.TEST_INVITATIONS}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <TestInvitations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.TEST_RESULTS}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <TestResultsList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.CREATE_CONTRACT}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <CreateContract />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.CONTRACT_DETAILS}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <ContractDetails />
                  </ProtectedRoute>
                } 
              />
              
              {/* Freelancer routes (protected) */}
              <Route 
                path={ROUTES.FREELANCER_DASHBOARD}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.FREELANCER}>
                    <FreelancerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.TEST_SELECTION}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.FREELANCER}>
                    <TestSelection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.TAKE_TEST}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.FREELANCER}>
                    <TakeTest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.TEST_RESULTS_VIEW}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.FREELANCER}>
                    <TestResults />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.CREATE_CONTRACT_FREELANCER}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.FREELANCER}>
                    <CreateContractFreelancer />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all 404 route - MUST BE LAST */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
