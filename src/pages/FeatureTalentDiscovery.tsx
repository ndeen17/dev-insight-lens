/**
 * TalentDiscovery Feature Page
 * Public page showcasing the AI-ranked talent discovery and leaderboard.
 */

import { Link } from 'react-router-dom';
import FeaturePageLayout from '@/components/FeaturePageLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  ArrowRight,
  Users,
  Trophy,
  GitBranch,
  Star,
  BarChart3,
  Search,
  Bookmark,
  CheckCircle,
  Sparkles,
  Filter,
  Globe,
  Code2,
} from 'lucide-react';

export default function FeatureTalentDiscovery() {
  const { isAuthenticated } = useAuth();

  return (
    <FeaturePageLayout>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-lime-50/30 via-white to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — text */}
            <div>
              <h1 className="text-display sm:text-[2.75rem] lg:text-[3.25rem] font-bold text-gray-900 tracking-tight leading-[1.15]">
                Find the right developer.<br /><span className="text-lime-500">Every single time.</span>
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-xl">
                Browse professionals ranked by verified GitHub skills, AI assessment scores, and contribution history. No self-reported claims — just real, verified data.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Trophy, text: 'AI-ranked leaderboard of verified developers' },
                  { icon: GitBranch, text: 'GitHub-verified skills and contribution patterns' },
                  { icon: Filter, text: 'Filter by language, framework, or skill score' },
                  { icon: Bookmark, text: 'Save and shortlist your favourite candidates' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-lime-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-lime-600" />
                    </div>
                    <span className="text-body text-gray-700">{text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-12 px-8 shadow-lg shadow-lime-200/40">
                  <Link to="/leaderboard">
                    Browse Leaderboard <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                {!isAuthenticated && (
                  <Button asChild variant="outline" size="lg" className="h-12 px-8 font-medium border-gray-300 hover:border-gray-400">
                    <Link to="/auth/signup">
                      Sign Up Free
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Right — Leaderboard mockup */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-heading-sm text-gray-900">Top Developers</h3>
                <span className="text-caption text-gray-500">Updated live</span>
              </div>

              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Sarah Chen', skills: 'React · TypeScript · Node.js', score: 94, avatar: 'SC' },
                  { rank: 2, name: 'Marcus Johnson', skills: 'Python · Django · AWS', score: 91, avatar: 'MJ' },
                  { rank: 3, name: 'Aisha Patel', skills: 'Go · Kubernetes · Terraform', score: 89, avatar: 'AP' },
                  { rank: 4, name: 'James Li', skills: 'Rust · WebAssembly · Systems', score: 87, avatar: 'JL' },
                  { rank: 5, name: 'Elena Rivera', skills: 'React Native · Swift · Flutter', score: 85, avatar: 'ER' },
                ].map(({ rank, name, skills, score, avatar }) => (
                  <div key={rank} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      rank === 2 ? 'bg-gray-100 text-gray-600' :
                      rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-500'
                    }`}>{rank}</span>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-white">{avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium text-gray-900 truncate">{name}</p>
                      <p className="text-caption text-gray-500 truncate">{skills}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-subheading text-gray-900">{score}</span>
                      <span className="text-caption text-gray-400">/100</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild variant="outline" className="w-full mt-5 h-10 font-medium">
                <Link to="/leaderboard">View Full Leaderboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How Discovery Works ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight">
              Verified by <span className="text-lime-600">data, not claims</span>
            </h2>
            <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
              Every developer on the leaderboard is ranked by real, verifiable data from GitHub and AI assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: GitBranch, title: 'GitHub Analysis', desc: 'AI analyses repos, commits, languages, and contribution quality.', color: 'bg-lime-50 text-lime-600' },
              { icon: Sparkles, title: 'AI Assessments', desc: 'Coding challenges scored by AI for quality and correctness.', color: 'bg-lime-50 text-lime-600' },
              { icon: BarChart3, title: '100-Point Score', desc: 'Unified ranking across 5 skill categories.', color: 'bg-lime-50 text-lime-600' },
              { icon: Trophy, title: 'Live Leaderboard', desc: 'Rankings update as developers complete new assessments.', color: 'bg-lime-50 text-lime-600' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-subheading text-gray-900 mb-1">{title}</h3>
                <p className="text-body-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── For employers ─── */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight leading-tight">
                Hire faster.<br /><span className="text-lime-600">Hire better.</span>
              </h2>
              <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
                Stop sifting through CVs and portfolios. Artemis shows you verified developers ranked by real coding ability, so you can shortlist confidently.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  { icon: Search, text: 'Search by language, framework, or skill level' },
                  { icon: Bookmark, text: 'Save promising candidates to your shortlist' },
                  { icon: Code2, text: 'View detailed GitHub analysis before contacting' },
                  { icon: Globe, text: 'Access a global pool of verified professionals' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-lime-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-lime-600" />
                    </div>
                    <span className="text-body text-gray-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Active Professionals', icon: Users, color: 'bg-lime-50', iconColor: 'text-lime-600' },
                { value: '30+', label: 'Countries Represented', icon: Globe, color: 'bg-lime-50', iconColor: 'text-lime-600' },
                { value: '50+', label: 'Languages & Frameworks', icon: Code2, color: 'bg-lime-50', iconColor: 'text-lime-600' },
                { value: '98%', label: 'Client Satisfaction', icon: Star, color: 'bg-lime-50', iconColor: 'text-lime-600' },
              ].map(({ value, label, icon: Icon, color, iconColor }) => (
                <div key={label} className={`${color} rounded-xl p-5 sm:p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)]`}>
                  <Icon className={`w-6 h-6 ${iconColor} mb-3`} />
                  <p className="text-display-sm font-bold text-gray-900">{value}</p>
                  <p className="text-caption text-gray-500 mt-1">{label}</p>
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
              Your next great hire is already <span className="underline decoration-lime-400 underline-offset-4">on the leaderboard.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              Browse AI-ranked developers, view their verified skills, and hire with confidence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-12 px-8 shadow-lg">
                <Link to="/auth/signup">
                  Start Free Today <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent text-white border-gray-700 hover:bg-gray-800 h-12 px-8 font-medium">
                <Link to="/leaderboard">
                  Browse Leaderboard
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </FeaturePageLayout>
  );
}
