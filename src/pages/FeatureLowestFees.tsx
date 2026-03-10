/**
 * LowestFees Feature Page
 * Public page showcasing Artemis's industry-lowest fee structure.
 * Includes earnings comparison and platform comparison table.
 */

import { Link } from 'react-router-dom';
import FeaturePageLayout from '@/components/FeaturePageLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Receipt,
  ArrowRight,
  Wallet,
  Target,
  BarChart3,
  CheckCircle,
  Check,
  Minus,
  Percent,
  TrendingUp,
  Banknote,
  Globe,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function FeatureLowestFees() {
  const { isAuthenticated } = useAuth();

  const renderCell = (value: boolean | string, isArtemis = false) => {
    if (value === true) {
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${isArtemis ? 'bg-lime-100' : 'bg-green-100'}`}>
          <Check className={`w-3.5 h-3.5 ${isArtemis ? 'text-lime-600' : 'text-green-600'}`} />
        </span>
      );
    }
    if (value === false) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
          <Minus className="w-3.5 h-3.5 text-gray-400" />
        </span>
      );
    }
    if (value === 'partial') {
      return <span className="text-caption text-yellow-600 font-medium">Partial</span>;
    }
    return (
      <span className={`text-caption font-medium ${isArtemis ? 'text-lime-700' : 'text-gray-600'}`}>{value}</span>
    );
  };

  return (
    <FeaturePageLayout>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-lime-50/40 via-white to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-display sm:text-[2.75rem] lg:text-[3.25rem] font-bold text-gray-900 tracking-tight leading-[1.15]">
              Tired of platforms<br /><span className="text-lime-600">eating your earnings?</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Just 3.6% for freelancers and 1.9% for clients. No hidden charges, no tiered pricing, no surprises. See how much more you keep with Artemis.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Earnings Comparison ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight">
              On a <span className="text-lime-600">$1,000 contract</span>, here's what you keep
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
            {/* Upwork */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-gray-400">U</span>
              </div>
              <p className="text-caption text-gray-500 font-medium uppercase tracking-wider mb-1">On Upwork</p>
              <p className="text-display-sm font-bold text-gray-900">$850</p>
              <p className="text-caption text-red-500 mt-1">You lose $150 (15%)</p>
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Fiverr */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-gray-400">F</span>
              </div>
              <p className="text-caption text-gray-500 font-medium uppercase tracking-wider mb-1">On Fiverr</p>
              <p className="text-display-sm font-bold text-gray-900">$800</p>
              <p className="text-caption text-red-500 mt-1">You lose $200 (20%)</p>
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            {/* Artemis */}
            <div className="bg-lime-50 rounded-xl border-2 border-lime-400 p-6 text-center relative shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-lime-500 text-gray-900 text-xs font-semibold rounded-full">
                Best Value
              </div>
              <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-lime-600" />
              </div>
              <p className="text-caption text-lime-700 font-medium uppercase tracking-wider mb-1">On Artemis</p>
              <p className="text-display-sm font-bold text-gray-900">$964</p>
              <p className="text-caption text-lime-600 font-semibold mt-1">You keep 96.4%</p>
              <div className="mt-4 h-2 bg-lime-100 rounded-full overflow-hidden">
                <div className="h-full bg-lime-500 rounded-full" style={{ width: '96.4%' }} />
              </div>
            </div>
          </div>

          <p className="text-center text-caption text-gray-400 mt-6">Based on a $1,000 fixed-price contract. Artemis charges just 3.6% to freelancers.</p>
        </div>
      </section>

      {/* ─── Comparison Table ─── */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight">
              Enjoy low fees.<br />Work safely <span className="text-lime-600">without overpaying.</span>
            </h2>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[640px] max-w-5xl mx-auto">
              <thead>
                <tr>
                  <th className="text-left text-caption text-gray-500 font-medium uppercase tracking-wider pb-4 pl-4 w-[200px]">Features</th>
                  <th className="text-center text-caption text-gray-400 font-medium uppercase tracking-wider pb-4">Upwork</th>
                  <th className="text-center text-caption text-gray-400 font-medium uppercase tracking-wider pb-4">Fiverr</th>
                  <th className="text-center pb-4">
                    <span className="text-caption text-lime-700 font-bold uppercase tracking-wider">Artemis</span>
                  </th>
                  <th className="text-center text-caption text-gray-400 font-medium uppercase tracking-wider pb-4">Paper Contracts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: 'Escrow Payment Protection', upwork: 'partial', fiverr: 'partial', artemis: true, paper: false },
                  { feature: 'Contract Types', upwork: 'One type', fiverr: 'One type', artemis: 'All types', paper: 'Non-flexible' },
                  { feature: 'Payment Options', upwork: 'USD + some local', fiverr: 'USD + some local', artemis: 'EUR, USD, Local', paper: 'Difficult to arrange' },
                  { feature: 'Freelancer Fees', upwork: 'Up to 15%', fiverr: '20%', artemis: '3.6%', paper: '0%' },
                  { feature: 'Client Fees', upwork: '5-30%', fiverr: '5.5%', artemis: '1.9%', paper: '0%' },
                  { feature: 'AI Skill Assessments', upwork: false, fiverr: false, artemis: true, paper: false },
                  { feature: 'GitHub Skill Verification', upwork: false, fiverr: false, artemis: true, paper: false },
                  { feature: 'Privacy', upwork: 'Partial', fiverr: 'Partial', artemis: 'Full', paper: 'Full' },
                ].map(({ feature, upwork, fiverr, artemis, paper }) => (
                  <tr key={feature} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 pl-4 text-body-sm text-gray-700 font-medium">{feature}</td>
                    <td className="py-3.5 text-center">{renderCell(upwork)}</td>
                    <td className="py-3.5 text-center">{renderCell(fiverr)}</td>
                    <td className="py-3.5 text-center bg-lime-50/50">{renderCell(artemis, true)}</td>
                    <td className="py-3.5 text-center">{renderCell(paper)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Fee Breakdown ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight">
              Simple, <span className="text-lime-600">transparent</span> pricing
            </h2>
            <p className="mt-4 text-body sm:text-lg text-gray-500">No tiers. No hidden costs. What you see is what you pay.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="w-14 h-14 bg-lime-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Banknote className="w-7 h-7 text-lime-600" />
              </div>
              <p className="text-caption text-gray-500 uppercase tracking-wider font-medium mb-2">Freelancer Fee</p>
              <p className="text-[3rem] font-bold text-gray-900 leading-none">3.6<span className="text-display-sm">%</span></p>
              <p className="text-body-sm text-gray-500 mt-2">Deducted from earnings when payment is released from escrow.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="w-14 h-14 bg-lime-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-7 h-7 text-lime-600" />
              </div>
              <p className="text-caption text-gray-500 uppercase tracking-wider font-medium mb-2">Client Fee</p>
              <p className="text-[3rem] font-bold text-gray-900 leading-none">1.9<span className="text-display-sm">%</span></p>
              <p className="text-body-sm text-gray-500 mt-2">Added to the contract total. Covers payment processing and platform use.</p>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: CheckCircle, text: 'No signup fee' },
              { icon: CheckCircle, text: 'No monthly fee' },
              { icon: CheckCircle, text: 'No withdrawal fee' },
              { icon: CheckCircle, text: 'No hidden charges' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-body-sm text-gray-600">
                <Icon className="w-4 h-4 text-lime-500 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      {!isAuthenticated && (
        <section className="py-16 sm:py-20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-display-sm sm:text-display text-white tracking-tight">
              Keep more of what you earn. <span className="text-lime-400">Switch to Artemis.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              Lower fees, escrow protection, AI assessments, and GitHub analysis. All in one platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-12 px-8 shadow-lg">
                <Link to="/auth/signup">
                  Start Free Today <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white text-gray-900 border-white hover:bg-gray-100 h-12 px-8 font-medium">
                <Link to="/leaderboard">
                  Explore Leaderboard
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </FeaturePageLayout>
  );
}
