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
const BrowseTalent = React.lazy(() => import("./pages/BrowseTalent"));
const TalentProfilePage = React.lazy(() => import("./pages/TalentProfile"));
const SavedDevelopers = React.lazy(() => import("./pages/SavedDevelopers"));
const EmployerOnboarding = React.lazy(() => import("./pages/EmployerOnboarding"));
const EmployerGettingStarted = React.lazy(() => import("./pages/EmployerGettingStarted"));
const CreateContract = React.lazy(() => import("./pages/CreateContract"));
const ContractDetails = React.lazy(() => import("./pages/ContractDetails"));

// Freelancer pages
const FreelancerOnboarding = React.lazy(() => import("./pages/FreelancerOnboarding"));
const FreelancerDashboard = React.lazy(() => import("./pages/FreelancerDashboard"));
const CreateContractFreelancer = React.lazy(() => import("./pages/CreateContractFreelancer"));

// Assessment pages (employer)
const EmployerAssessments = React.lazy(() => import("./pages/EmployerAssessments"));
const CreateAssessment = React.lazy(() => import("./pages/CreateAssessment"));
const AssessmentDetail = React.lazy(() => import("./pages/AssessmentDetail"));
const SessionResults = React.lazy(() => import("./pages/SessionResults"));

// Assessment pages (freelancer + shared)
const AssessmentInvite = React.lazy(() => import("./pages/AssessmentInvite"));
const AssessmentShell = React.lazy(() => import("./pages/AssessmentShell"));
const FreelancerAssessments = React.lazy(() => import("./pages/FreelancerAssessments"));

// Shared pages (both roles)
const ContractSent = React.lazy(() => import("./pages/ContractSent"));
const ContractRespond = React.lazy(() => import("./pages/ContractRespond"));
const ProfileSettings = React.lazy(() => import("./pages/ProfileSettings"));

// Freelancer balance & withdrawals
const Withdrawals = React.lazy(() => import("./pages/Withdrawals"));

// Admin pages
const AdminWithdrawals = React.lazy(() => import("./pages/AdminWithdrawals"));
const AdminBroadcast = React.lazy(() => import("./pages/AdminBroadcast"));

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
                path={ROUTES.BROWSE_TALENT}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <BrowseTalent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.TALENT_PROFILE}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <TalentProfilePage />
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
                path={ROUTES.FREELANCER_ONBOARDING}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.FREELANCER}>
                    <FreelancerOnboarding />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.FREELANCER_DASHBOARD}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.FREELANCER}>
                    <FreelancerDashboard />
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
              
              {/* Employer assessment routes */}
              <Route 
                path={ROUTES.EMPLOYER_ASSESSMENTS}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <EmployerAssessments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.CREATE_ASSESSMENT}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <CreateAssessment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.ASSESSMENT_RESULTS}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <SessionResults />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.ASSESSMENT_DETAIL}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.BUSINESS_OWNER}>
                    <AssessmentDetail />
                  </ProtectedRoute>
                } 
              />

              {/* Assessment routes (freelancer + shared) */}
              <Route 
                path={ROUTES.ASSESSMENT_INVITE}
                element={
                  <ProtectedRoute>
                    <AssessmentInvite />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.ASSESSMENT_SESSION}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.FREELANCER}>
                    <AssessmentShell />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.ASSESSMENT_INVITATIONS}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.FREELANCER}>
                    <FreelancerAssessments />
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
                path={ROUTES.SETTINGS}
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
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
              <Route 
                path={ROUTES.ADMIN_BROADCAST}
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                    <AdminBroadcast />
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
