/**
 * FeaturePageLayout
 * Shared shell for public feature pages — consistent nav + footer.
 * Uses the new lime-green accent design language.
 */

import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Target,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  GitBranch,
  Shield,
  FileText,
  ClipboardCheck,
} from 'lucide-react';

interface FeaturePageLayoutProps {
  children: ReactNode;
}

export default function FeaturePageLayout({ children }: FeaturePageLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/auth/signin';
    return user?.role === 'BusinessOwner' ? '/employer/dashboard' : '/freelancer/dashboard';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navigation ─── */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-heading-sm font-semibold text-gray-900 tracking-tight">
              <Target className="w-5 h-5 text-lime-500" />Artemis
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                <Link to={ROUTES.FEATURE_GITHUB_ANALYSIS} className="text-body-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Verify</Link>
                <Link to={ROUTES.FEATURE_SMART_CONTRACTS} className="text-body-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Hire</Link>
                <Link to={ROUTES.FEATURE_ESCROW_PAYMENTS} className="text-body-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Pay</Link>
                <Link to="/leaderboard" className="text-body-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Leaderboard</Link>
              </div>
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                {isAuthenticated ? (
                  <Button asChild size="sm" className="bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-9 px-4 shadow-sm">
                    <Link to={getDashboardLink()}>Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild className="text-body-sm font-medium h-9">
                      <Link to="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-9 px-4 shadow-sm">
                      <Link to="/auth/signup">Start Free Today</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile nav dropdown */}
          {mobileNavOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 space-y-1 animate-fade-in-up">
              <Link to={ROUTES.FEATURE_GITHUB_ANALYSIS} onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-body text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Verify</Link>
              <Link to={ROUTES.FEATURE_SMART_CONTRACTS} onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-body text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Hire</Link>
              <Link to={ROUTES.FEATURE_ESCROW_PAYMENTS} onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-body text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Pay</Link>
              <Link to="/leaderboard" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-body text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Leaderboard</Link>
              <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Button asChild className="w-full bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold">
                    <Link to={getDashboardLink()}>Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold">
                      <Link to="/auth/signup">Start Free Today</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ─── Back to Home ─── */}
      <div className="border-b border-gray-100 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 py-3 text-body-sm text-gray-500 hover:text-gray-900 transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* ─── Page Content ─── */}
      <main>{children}</main>

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <span className="flex items-center gap-2 text-heading-sm font-semibold text-white">
                <Target className="w-5 h-5 text-lime-400" />Artemis
              </span>
              <p className="mt-3 text-body-sm text-gray-400 leading-relaxed">
                The complete remote work platform for Employers and Freelancers. Find talent, manage contracts, and handle payments — all in one place.
              </p>
            </div>
            <div>
              <h4 className="text-caption text-gray-300 font-semibold uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2.5">
                <li><Link to={ROUTES.FEATURE_AI_ASSESSMENTS} className="text-body-sm text-gray-400 hover:text-white transition-colors">AI Assessments</Link></li>
                <li><Link to={ROUTES.FEATURE_GITHUB_ANALYSIS} className="text-body-sm text-gray-400 hover:text-white transition-colors">GitHub Analysis</Link></li>
                <li><Link to={ROUTES.FEATURE_SMART_CONTRACTS} className="text-body-sm text-gray-400 hover:text-white transition-colors">Smart Contracts</Link></li>
                <li><Link to={ROUTES.FEATURE_ESCROW_PAYMENTS} className="text-body-sm text-gray-400 hover:text-white transition-colors">Escrow Payments</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-caption text-gray-300 font-semibold uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><span className="text-body-sm text-gray-500">About</span></li>
                <li><span className="text-body-sm text-gray-500">Blog</span></li>
                <li><span className="text-body-sm text-gray-500">Careers</span></li>
                <li><span className="text-body-sm text-gray-500">Contact</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-caption text-gray-300 font-semibold uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><span className="text-body-sm text-gray-500">Privacy Policy</span></li>
                <li><span className="text-body-sm text-gray-500">Terms of Service</span></li>
                <li><span className="text-body-sm text-gray-500">Cookie Policy</span></li>
                <li><span className="text-body-sm text-gray-500">GDPR Compliance</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-caption text-gray-500">&copy; {new Date().getFullYear()} Artemis. All rights reserved.</p>
            <p className="text-caption text-gray-600">Not affiliated with GitHub, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
