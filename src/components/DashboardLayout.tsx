import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import EmailVerificationBanner from './EmailVerificationBanner';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole?: 'BusinessOwner' | 'Freelancer';
}

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed left navigation */}
      <Sidebar userRole={userRole} />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="min-h-screen animate-page-enter">
          {/* Email verification banner - shows on all dashboard pages */}
          <EmailVerificationBanner />
          {children}
        </div>
      </div>
    </div>
  );
}
