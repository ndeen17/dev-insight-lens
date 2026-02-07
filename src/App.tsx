import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ROUTES, USER_ROLES } from "@/config/constants";
import React, { Suspense } from "react";

// Loading fallback
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

// ─── Lazy-loaded pages (code-split) ────────────────────────────
// Public pages
const Index = React.lazy(() => import("./pages/Index"));
const Leaderboard = React.lazy(() => import("./pages/Leaderboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Auth pages
const SignIn = React.lazy(() => import("./pages/SignIn"));
const RoleSelection = React.lazy(() => import("./pages/RoleSelection"));
const FreelancerSignup = React.lazy(() => import("./pages/FreelancerSignup"));
const BusinessOwnerSignup = React.lazy(() => import("./pages/BusinessOwnerSignup"));
const VerifyEmail = React.lazy(() => import("./pages/VerifyEmail"));

// Employer pages
const EmployerDashboard = React.lazy(() => import("./pages/EmployerDashboard"));
const BrowseDevelopers = React.lazy(() => import("./pages/BrowseDevelopers"));
const SavedDevelopers = React.lazy(() => import("./pages/SavedDevelopers"));
const TestSelection = React.lazy(() => import("./pages/TestSelection"));
const TakeTest = React.lazy(() => import("./pages/TakeTest"));
const TestResults = React.lazy(() => import("./pages/TestResults"));
const TestResultsList = React.lazy(() => import("./pages/TestResultsList"));
const TestingHub = React.lazy(() => import("./pages/TestingHub"));
const EmployerOnboarding = React.lazy(() => import("./pages/EmployerOnboarding"));
const EmployerGettingStarted = React.lazy(() => import("./pages/EmployerGettingStarted"));
const TestInvitations = React.lazy(() => import("./pages/TestInvitations"));
const CreateContract = React.lazy(() => import("./pages/CreateContract"));
const ContractDetails = React.lazy(() => import("./pages/ContractDetails"));

// Freelancer pages
const FreelancerDashboard = React.lazy(() => import("./pages/FreelancerDashboard"));
const CreateContractFreelancer = React.lazy(() => import("./pages/CreateContractFreelancer"));

// Shared pages (both roles)
const ContractSent = React.lazy(() => import("./pages/ContractSent"));
const ContractRespond = React.lazy(() => import("./pages/ContractRespond"));

// Freelancer balance & withdrawals
const Withdrawals = React.lazy(() => import("./pages/Withdrawals"));

// Admin pages
const AdminWithdrawals = React.lazy(() => import("./pages/AdminWithdrawals"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes
      gcTime: 10 * 60 * 1000,     // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <NotificationProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoading />}>
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
                  <ProtectedRoute>
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
              
              {/* Shared routes (both roles) */}
              <Route 
                path={ROUTES.CONTRACT_SENT}
                element={
                  <ProtectedRoute>
                    <ContractSent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.CONTRACT_RESPOND}
                element={
                  <ProtectedRoute>
                    <ContractRespond />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.WITHDRAWALS}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.FREELANCER}>
                    <Withdrawals />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.ADMIN_WITHDRAWALS}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                    <AdminWithdrawals />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all 404 route - MUST BE LAST */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
