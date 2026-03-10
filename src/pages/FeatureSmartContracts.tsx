/**
 * SmartContracts Feature Page
 * Public page showcasing the Smart Contract system with milestone tracking.
 */

import { Link } from 'react-router-dom';
import FeaturePageLayout from '@/components/FeaturePageLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Milestone,
  ListChecks,
  FileCheck2,
  Users,
  Zap,
  Lock,
  BadgeCheck,
  CircleDot,
  Timer,
} from 'lucide-react';

export default function FeatureSmartContracts() {
  const { isAuthenticated } = useAuth();

  return (
    <FeaturePageLayout>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-lime-50/30 via-white to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-display sm:text-[2.75rem] lg:text-[3.25rem] font-bold text-gray-900 tracking-tight leading-[1.15]">
              Contracts that <span className="text-lime-500">actually work.</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Create fixed-price or hourly contracts with built-in milestone tracking,
              automated approval workflows, and escrow protection — all in minutes.
            </p>
          </div>

          {/* Contract card mockup */}
          <div className="mt-12 max-w-lg mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-heading-sm text-gray-900">React Dashboard Build</h3>
                  <p className="text-caption text-gray-500 mt-0.5">Fixed Price · £4,500</p>
                </div>
                <span className="inline-flex items-center gap-1 text-caption text-lime-700 font-medium bg-lime-50 px-2.5 py-1 rounded-full">
                  <CircleDot className="w-3 h-3" /> Active
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Project Setup & Architecture', status: 'Completed', statusColor: 'bg-lime-50 text-lime-700', icon: CheckCircle, iconColor: 'text-lime-600' },
                  { name: 'Component Library', status: 'Completed', statusColor: 'bg-lime-50 text-lime-700', icon: CheckCircle, iconColor: 'text-lime-600' },
                  { name: 'API Integration', status: 'In Progress', statusColor: 'bg-gray-100 text-gray-700', icon: Timer, iconColor: 'text-gray-600' },
                  { name: 'Testing & QA', status: 'Pending', statusColor: 'bg-gray-100 text-gray-500', icon: Clock, iconColor: 'text-gray-400' },
                  { name: 'Deployment & Handoff', status: 'Pending', statusColor: 'bg-gray-100 text-gray-500', icon: Clock, iconColor: 'text-gray-400' },
                ].map(({ name, status, statusColor, icon: Icon, iconColor }) => (
                  <div key={name} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${iconColor}`} />
                      <span className="text-body-sm text-gray-700">{name}</span>
                    </div>
                    <span className={`text-caption font-medium px-2.5 py-1 rounded-full ${statusColor}`}>{status}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-caption text-gray-500 mb-2">
                  <span>Progress</span>
                  <span className="font-medium text-gray-700">40%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-lime-500 rounded-full transition-all duration-500" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Contract Types ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight">
              Flexible contracts for <span className="text-lime-600">every project</span>
            </h2>
            <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
              Choose the contract type that fits your project. All types include escrow protection and milestone tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: FileText,
                title: 'Fixed Price',
                description: 'Set a total budget upfront. Pay per milestone as work is delivered and approved. Best for well-defined projects.',
                features: ['Defined scope & deliverables', 'Milestone-based payments', 'Escrow-protected budget'],
                color: 'bg-lime-50 text-lime-600',
              },
              {
                icon: Timer,
                title: 'Hourly Rate',
                description: 'Agree on an hourly rate and track hours worked. Pay weekly or monthly. Best for ongoing work.',
                features: ['Time tracking built-in', 'Weekly/monthly invoicing', 'Automatic escrow deposits'],
                color: 'bg-lime-50 text-lime-600',
              },
              {
                icon: ListChecks,
                title: 'Milestone-Based',
                description: 'Split the project into milestones with individual budgets. Release payment as each milestone is completed.',
                features: ['Granular progress tracking', 'Per-milestone approval', 'Phased payment release'],
                color: 'bg-lime-50 text-lime-600',
              },
            ].map(({ icon: Icon, title, description, features, color }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-heading-sm text-gray-900 mb-2">{title}</h3>
                <p className="text-body-sm text-gray-500 leading-relaxed mb-5">{description}</p>
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-body-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-lime-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight leading-tight">
                Every contract is<br /><span className="text-lime-600">protected by default.</span>
              </h2>
              <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
                Unlike paper contracts or email agreements, Artemis contracts are backed by technology. Funds are in escrow, milestones are tracked, and both parties have full visibility.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Lock, title: 'Escrow Built-In', desc: 'Payments are secured automatically', color: 'bg-lime-50', iconColor: 'text-lime-600' },
                { icon: Users, title: 'Both Parties Protected', desc: 'Fair terms for clients & freelancers', color: 'bg-lime-50', iconColor: 'text-lime-600' },
                { icon: Zap, title: 'Instant Setup', desc: 'Create a contract in under 2 minutes', color: 'bg-lime-50', iconColor: 'text-lime-600' },
                { icon: FileCheck2, title: 'Dispute Resolution', desc: 'Built-in mediation for every contract', color: 'bg-lime-50', iconColor: 'text-lime-600' },
              ].map(({ icon: Icon, title, desc, color, iconColor }) => (
                <div key={title} className={`${color} rounded-xl p-5 sm:p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-200`}>
                  <Icon className={`w-6 h-6 ${iconColor} mb-3`} />
                  <h4 className="text-subheading text-gray-900 mb-1">{title}</h4>
                  <p className="text-caption text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      {!isAuthenticated && (
        <section className="py-16 sm:py-20 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-display-sm sm:text-display text-white tracking-tight">
              Hire with confidence. <span className="underline decoration-lime-400 underline-offset-4">Ship with clarity.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              Create your first smart contract in minutes — with escrow, milestones, and dispute resolution built in.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-12 px-8 shadow-lg">
                <Link to="/auth/signup">
                  Start Free Today <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </FeaturePageLayout>
  );
}
