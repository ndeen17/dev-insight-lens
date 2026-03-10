/**
 * AIAssessments Feature Page
 * Public page showcasing the AI-powered technical assessment system.
 */

import { Link } from 'react-router-dom';
import FeaturePageLayout from '@/components/FeaturePageLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  Code2,
  Timer,
  BarChart3,
  CheckCircle,
  Zap,
  Shield,
  Users,
  Brain,
  MessageSquare,
  Award,
  Play,
  FileText,
} from 'lucide-react';

export default function FeatureAIAssessments() {
  const { isAuthenticated } = useAuth();

  return (
    <FeaturePageLayout>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear_gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-lime-50/30 via-white to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — text */}
            <div>
              <h1 className="text-display sm:text-[2.75rem] lg:text-[3.25rem] font-bold text-gray-900 tracking-tight leading-[1.15]">
                Test real skills.<br /><span className="text-lime-500">Not interview tricks.</span>
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-xl">
                Create AI-powered coding assessments in any language or framework. Candidates solve real problems while our AI scores in real-time.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Sparkles, text: 'AI generates assessments tailored to any tech stack' },
                  { icon: Code2, text: 'Real coding challenges — not memorised riddles' },
                  { icon: Timer, text: 'Timed sessions with live progress tracking' },
                  { icon: BarChart3, text: 'Detailed scoring with AI-powered feedback' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-lime-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-lime-600" />
                    </div>
                    <span className="text-body text-gray-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Assessment mockup */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-heading-sm text-gray-900">React Assessment</h3>
                  <p className="text-caption text-gray-500">3 challenges · 45 min</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-caption text-lime-700 font-medium bg-lime-50 px-2.5 py-1 rounded-full">
                  <Play className="w-3 h-3" /> Live
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { name: 'Build a custom hook for API fetching', score: '92/100', status: 'Completed', color: 'text-lime-700 bg-lime-50' },
                  { name: 'Implement a responsive data table', score: '87/100', status: 'Completed', color: 'text-lime-700 bg-lime-50' },
                  { name: 'Optimise component rendering', score: '—', status: 'In Progress', color: 'text-gray-700 bg-gray-100' },
                ].map(({ name, score, status, color }) => (
                  <div key={name} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-body-sm font-medium text-gray-900">{name}</span>
                      <span className={`text-caption font-medium px-2 py-0.5 rounded-full ${color}`}>{status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-caption text-gray-500">AI Score</span>
                      <span className="text-caption font-semibold text-gray-700">{score}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-lime-50 rounded-xl p-4 flex items-start gap-3">
                <Brain className="w-5 h-5 text-lime-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-body-sm font-medium text-gray-900">AI Insight</p>
                  <p className="text-caption text-gray-600 mt-0.5">Strong React fundamentals. Excellent use of hooks and memoisation patterns. Above average for mid-level candidates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight">
              Create, send, <span className="text-lime-600">and score</span> in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: FileText,
                title: 'Create an Assessment',
                description: 'Choose a tech stack, set the difficulty, and let AI generate tailored coding challenges. Or write your own.',
              },
              {
                step: '02',
                icon: MessageSquare,
                title: 'Send to Candidates',
                description: 'Share a unique invite link. Candidates complete the assessment in a timed, secure coding environment.',
              },
              {
                step: '03',
                icon: Award,
                title: 'Review AI Scores',
                description: 'Get detailed scoring with AI feedback on code quality, correctness, efficiency, and best practices.',
              },
            ].map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md shadow-gray-200/40">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-overline text-lime-600 mb-2 block">STEP {step}</span>
                <h3 className="text-heading-sm text-gray-900 mb-2">{title}</h3>
                <p className="text-body-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features grid ─── */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight">
              Built for <span className="text-lime-600">serious hiring</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'AI-Generated Challenges', desc: 'Tailored to any language, framework, or seniority level.' },
              { icon: Timer, title: 'Timed Sessions', desc: 'Set time limits to assess how candidates work under pressure.' },
              { icon: Code2, title: 'Real Code Environment', desc: 'Candidates write and run real code — not multiple choice.' },
              { icon: BarChart3, title: 'Detailed Scorecards', desc: 'AI evaluates code quality, correctness, and efficiency.' },
              { icon: Shield, title: 'Anti-Cheat Measures', desc: 'Tab-switching detection and session integrity monitoring.' },
              { icon: Users, title: 'Bulk Invites', desc: 'Send assessments to multiple candidates with one click.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 bg-lime-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-lime-600" />
                </div>
                <h3 className="text-subheading text-gray-900 mb-1">{title}</h3>
                <p className="text-body-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      {!isAuthenticated && (
        <section className="py-16 sm:py-20 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-display-sm sm:text-display text-white tracking-tight">
              Stop guessing skills. <span className="underline decoration-lime-400 underline-offset-4">Start testing them.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              AI assessments, GitHub verification, smart contracts, and escrow payments — all in one platform.
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
