/**
 * GitHubAnalysis Feature Page
 * Public page showcasing the GitHub Profile Analysis tool.
 * Includes a live interactive analysis widget + explanation of how it works.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import FeaturePageLayout from '@/components/FeaturePageLayout';
import GitHubInput from '@/components/GitHubInput';
import LoadingState from '@/components/LoadingState';
import ResultsCard from '@/components/ResultsCard';
import ErrorMessage from '@/components/ErrorMessage';
import HealthCheck from '@/components/HealthCheck';
import { ViewMode } from '@/components/ModeToggle';
import { analyzeGitHubProfile } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  GitBranch,
  ArrowRight,
  Search,
  BarChart3,
  Code2,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  Users,
  Star,
  Eye,
} from 'lucide-react';

export default function FeatureGitHubAnalysis() {
  const { isAuthenticated } = useAuth();
  const [appState, setAppState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [githubUrl, setGithubUrl] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('recruiter');

  const handleAnalyze = async (url: string) => {
    setAppState('loading');
    setError(null);
    setResults(null);
    try {
      const response = await analyzeGitHubProfile(url, false);
      setResults(response.data);
      setAppState('success');
    } catch (err: any) {
      setError(err.message);
      setAppState('error');
    }
  };

  return (
    <FeaturePageLayout>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-lime-50/30 via-lime-50/10 to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20">
          {/* Centered hero content */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-display sm:text-[2.75rem] lg:text-[3.25rem] font-bold text-gray-900 tracking-tight leading-[1.15]">
              Know who you're hiring<br className="hidden sm:block" />
              <span className="text-lime-500">before you say hello.</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Our AI analyses any GitHub profile in seconds — revealing real coding skills,
              contribution patterns, language proficiency, and project quality. No more guessing.
            </p>

            {/* Trust points — horizontal row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {[
                { icon: Search, text: 'Paste any GitHub URL' },
                { icon: Sparkles, text: 'AI-powered analysis' },
                { icon: BarChart3, text: '100-point skill score' },
                { icon: ShieldCheck, text: 'Verified skills' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-lime-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-lime-600" />
                  </div>
                  <span className="text-body-sm text-gray-600 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Centered GitHub Analysis Widget */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8">
              <div className="text-center mb-5">
                <h2 className="text-heading-sm text-gray-900">Try It Now</h2>
                <p className="text-body-sm text-gray-500 mt-1">Paste any GitHub profile URL below to see AI-powered skill insights</p>
              </div>
              <GitHubInput
                value={githubUrl}
                onChange={setGithubUrl}
                onAnalyze={handleAnalyze}
                disabled={appState === 'loading'}
              />
              <div className="flex items-center justify-center mt-3">
                <HealthCheck />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Results ─── */}
      {appState !== 'idle' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {appState === 'loading' && <LoadingState />}
          {appState === 'success' && <ResultsCard results={results} mode={viewMode} onModeChange={setViewMode} />}
          {appState === 'error' && <ErrorMessage error={error} onRetry={() => setAppState('idle')} />}
        </div>
      )}

      {/* ─── How It Works ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-caption text-lime-600 font-semibold uppercase tracking-wider">How It Works</span>
            <h2 className="mt-3 text-display-sm sm:text-display text-gray-900 tracking-tight">
              From URL to <span className="text-lime-600">verified profile</span> in seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Paste a GitHub URL',
                description: 'Enter the GitHub profile link of any developer you want to evaluate. Works with any public profile.',
              },
              {
                step: '02',
                icon: Sparkles,
                title: 'AI Analyses Everything',
                description: 'Our AI reviews repositories, commits, languages, contribution frequency, code quality, and project diversity.',
              },
              {
                step: '03',
                icon: BarChart3,
                title: 'Get a Skill Report',
                description: 'Receive a detailed scorecard with a 100-point rating across Code Quality, Consistency, Technical Breadth, Impact, and Seniority.',
              },
            ].map(({ step, icon: Icon, title, description }, idx) => (
              <div key={step} className="relative">
                {/* Connector line (desktop only) */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gray-200" />
                )}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 text-center relative shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md shadow-gray-200/40">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-overline text-lime-600 mb-2 block">STEP {step}</span>
                  <h3 className="text-heading-sm text-gray-900 mb-2">{title}</h3>
                  <p className="text-body-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What Gets Analysed ─── */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight">
              Five categories. <span className="text-lime-600">One unified score.</span>
            </h2>
            <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
              Every profile is evaluated on a 100-point scale across these skill areas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
            {[
              { icon: Code2, title: 'Code Quality', points: '20 pts', desc: 'Clean code, patterns, documentation' },
              { icon: TrendingUp, title: 'Consistency', points: '20 pts', desc: 'Commit frequency and streak activity' },
              { icon: GitBranch, title: 'Technical Breadth', points: '20 pts', desc: 'Languages, frameworks, diversity' },
              { icon: Star, title: 'Impact', points: '20 pts', desc: 'Stars, forks, community engagement' },
              { icon: Eye, title: 'Seniority', points: '20 pts', desc: 'Experience level and complexity' },
            ].map(({ icon: Icon, title, points, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 bg-lime-50 text-lime-600 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-subheading text-gray-900">{title}</h4>
                <span className="text-caption text-lime-600 font-semibold">{points}</span>
                <p className="text-caption text-gray-500 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Use GitHub Analysis ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-caption text-lime-600 font-semibold uppercase tracking-wider">Why Use This</span>
              <h2 className="mt-3 text-display-sm sm:text-display text-gray-900 tracking-tight leading-tight">
                Stop reading résumés.<br /><span className="text-lime-500">Start reading code.</span>
              </h2>
              <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
                Résumés lie. GitHub doesn't. Our AI digs into real contribution history to separate
                genuinely skilled developers from those who only talk the talk.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  { icon: CheckCircle, text: 'Analyse any public GitHub profile instantly' },
                  { icon: Users, text: 'Compare multiple candidates side by side' },
                  { icon: ShieldCheck, text: 'Verified skills — no self-reported claims' },
                  { icon: TrendingUp, text: 'Track contribution trends over time' },
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

            {/* Visual mockup card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-bold text-white">JD</div>
                <div>
                  <p className="text-subheading text-gray-900">Jane Developer</p>
                  <p className="text-caption text-gray-500">github.com/janedev</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-lime-50 text-caption text-lime-700 font-semibold">Score: 87/100</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Code Quality', score: 18, max: 20, pct: '90%' },
                  { label: 'Consistency', score: 17, max: 20, pct: '85%' },
                  { label: 'Technical Breadth', score: 19, max: 20, pct: '95%' },
                  { label: 'Impact', score: 16, max: 20, pct: '80%' },
                  { label: 'Seniority', score: 17, max: 20, pct: '85%' },
                ].map(({ label, score, max, pct }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-caption text-gray-700 font-medium">{label}</span>
                      <span className="text-caption text-gray-500">{score}/{max}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-400 rounded-full transition-all duration-500" style={{ width: pct }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-2">
                  {['TypeScript', 'React', 'Node.js'].map((lang) => (
                    <span key={lang} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{lang}</span>
                  ))}
                </div>
                <span className="text-caption text-gray-400">342 contributions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      {!isAuthenticated && (
        <section className="py-16 sm:py-20 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-display-sm sm:text-display text-white tracking-tight">
              Stop guessing. <span className="underline decoration-lime-400 underline-offset-4">Start verifying.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              Join Artemis and get AI-powered GitHub analysis, skill assessments, smart contracts, and escrow payments — all in one platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-12 px-8 shadow-lg shadow-lime-400/20">
                <Link to="/auth/signup">
                  Start Free Today <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent text-white border-gray-700 hover:bg-gray-800 h-12 px-8 font-medium">
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
