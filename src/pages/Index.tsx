import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyzeGitHubProfile } from '../services/api';
import GitHubInput from '../components/GitHubInput';
import LoadingState from '../components/LoadingState';
import ResultsCard from '../components/ResultsCard';
import ErrorMessage from '../components/ErrorMessage';
import HealthCheck from '../components/HealthCheck';
import { ViewMode } from '../components/ModeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  GitBranch, 
  ClipboardCheck, 
  TrendingUp, 
  ArrowRight, 
  Briefcase, 
  FileText, 
  Shield, 
  Zap, 
  Globe, 
  ChevronRight, 
  Menu, 
  X, 
  Users, 
  DollarSign, 
  BarChart3,
  CheckCircle,
  Star,
  Target,
  BadgeCheck,
  Lock,
  Clock,
  Wallet,
  Eye,
  EyeOff,
  Percent,
  ArrowDown,
  Sparkles,
  HandCoins,
  ShieldCheck,
  CircleDollarSign,
  Receipt,
  UserCheck,
  FileCheck2,
  Send,
  Check,
  Minus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const [appState, setAppState] = useState('idle');
  const [githubUrl, setGithubUrl] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState<ViewMode>('recruiter');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  const heroSlides = [
    {
      highlight: 'hire top talent.',
      subtitle: 'AI-ranked developers with verified GitHub profiles and live assessment scores.',
    },
    {
      highlight: 'verify real skills.',
      subtitle: 'GitHub analysis reveals true coding ability, languages, and contribution quality.',
    },
    {
      highlight: 'protect every payment.',
      subtitle: 'Funds held safely in escrow until milestones are delivered and approved.',
    },
    {
      highlight: 'test any developer.',
      subtitle: 'AI-powered coding assessments with real-time scoring across any tech stack.',
    },
    {
      highlight: 'ship with confidence.',
      subtitle: 'Smart contracts, milestone tracking, and the lowest fees in the industry.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async (url) => {
    setAppState('loading');
    setError(null);
    setResults(null);

    try {
      const response = await analyzeGitHubProfile(url, false);
      setResults(response.data);
      setAppState('success');
    } catch (err) {
      setError(err.message);
      setAppState('error');
    }
  };

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/auth/signin';
    return user?.role === 'BusinessOwner' ? '/employer/dashboard' : '/freelancer/dashboard';
  };

  const renderComparisonCell = (value: boolean | string, isArtemis = false) => {
    if (value === true) {
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${isArtemis ? 'bg-emerald-100' : 'bg-green-100'}`}>
          <Check className={`w-3.5 h-3.5 ${isArtemis ? 'text-emerald-600' : 'text-green-600'}`} />
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
      <span className={`text-caption font-medium ${isArtemis ? 'text-emerald-700' : 'text-gray-600'}`}>
        {value}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navigation ─── */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-heading-sm font-semibold text-gray-900 tracking-tight">
              <Target className="w-5 h-5 text-blue-600" />Artemis
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                <a href="#features" className="text-body-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Features</a>
                <a href="#how-it-works" className="text-body-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">How It Works</a>
                <Link to="/leaderboard" className="text-body-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Leaderboard</Link>
                {isAuthenticated && user?.role === 'BusinessOwner' && (
                  <Link to="/employer/talent" className="text-body-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Browse Talent</Link>
                )}
              </div>
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                {isAuthenticated ? (
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 !text-white font-semibold h-9 px-4">
                    <Link to={getDashboardLink()}>Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild className="text-body-sm font-medium h-9">
                      <Link to="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 !text-white font-semibold h-9 px-4">
                      <Link to="/auth/signup">Get Started</Link>
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
              <a href="#features" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-body text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Features</a>
              <a href="#how-it-works" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-body text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">How It Works</a>
              <Link to="/leaderboard" className="block px-3 py-2.5 text-body text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Leaderboard</Link>
              <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 !text-white font-semibold">
                    <Link to={getDashboardLink()}>Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 !text-white font-semibold">
                      <Link to="/auth/signup">Get Started Free</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-blue-50/20 to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-caption text-blue-700 font-medium mb-6">
              <Target className="w-3.5 h-3.5" />
              Hire Smarter &middot; Work Safer &middot; Pay Less
            </div>

            <h1 className="text-display sm:text-[2.75rem] lg:text-[3.25rem] font-bold text-gray-900 tracking-tight leading-[1.15]">
              The smarter way to<br className="hidden sm:block" />
              <span className="inline-block overflow-hidden h-[1.2em] align-bottom">
                <span
                  key={heroIndex}
                  className="inline-block text-emerald-600 hero-text-reveal"
                >
                  {heroSlides[heroIndex].highlight}
                </span>
              </span>
            </h1>

            <div className="overflow-hidden">
              <p
                key={`sub-${heroIndex}`}
                className="mt-5 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed hero-subtitle-reveal"
              >
                {heroSlides[heroIndex].subtitle}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Button asChild size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 !text-white font-semibold h-12 px-8 text-body shadow-lg shadow-emerald-200/50">
                    <Link to="/auth/signup">
                      Start Free Today
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-body font-medium border-gray-300 hover:border-gray-400">
                    <Link to="/leaderboard">
                      Browse Talent
                    </Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 !text-white font-semibold h-12 px-8 text-body shadow-lg shadow-blue-200/50">
                  <Link to={getDashboardLink()}>
                    Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-caption text-gray-400">
              <span className="flex items-center gap-1.5"><ClipboardCheck className="w-3.5 h-3.5 text-blue-500" /> AI Assessments</span>
              <span className="flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5 text-blue-500" /> GitHub Analysis</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-500" /> Escrow Protected</span>
              <span className="flex items-center gap-1.5"><Percent className="w-3.5 h-3.5 text-blue-500" /> Lowest Fees</span>
            </div>
          </div>

          {/* GitHub Analysis Widget */}
          <div className="mt-14 max-w-2xl mx-auto">
            <Card className="border border-gray-200 shadow-lg bg-white">
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-heading-sm text-gray-900">Try GitHub Profile Analysis</CardTitle>
                <CardDescription className="text-body-sm text-gray-500">
                  Paste any GitHub URL to see AI-powered skill insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GitHubInput 
                  value={githubUrl}
                  onChange={setGithubUrl}
                  onAnalyze={handleAnalyze}
                  disabled={appState === 'loading'}
                />
              </CardContent>
            </Card>
            <div className="flex items-center justify-center mt-3">
              <HealthCheck />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {appState !== 'idle' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {appState === 'loading' && <LoadingState />}
          {appState === 'success' && <ResultsCard results={results} mode={viewMode} onModeChange={setViewMode} />}
          {appState === 'error' && <ErrorMessage error={error} onRetry={() => setAppState('idle')} />}
        </div>
      )}

      {/* ─── Features Section ─── */}
      <section id="features" className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-caption text-blue-600 font-semibold uppercase tracking-wider">Platform Features</span>
            <h2 className="mt-3 text-display-sm sm:text-display text-gray-900 tracking-tight">
              Everything you need to manage remote work
            </h2>
            <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
              From finding top talent to processing payments, streamlined for modern teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: TrendingUp,
                color: 'bg-blue-50 text-blue-600',
                title: 'AI-Ranked Talent Discovery',
                description: 'Browse professionals ranked by verified GitHub skills, assessment scores, and contribution history. No guesswork.',
                link: isAuthenticated ? undefined : '/leaderboard',
                linkText: 'Browse Developers',
              },
              {
                icon: FileText,
                color: 'bg-indigo-50 text-indigo-600',
                title: 'Smart Contracts',
                description: 'Create fixed-price or hourly contracts with milestone tracking, automated approval workflows, and built-in escrow protection.',
                link: isAuthenticated && user?.role === 'BusinessOwner' ? '/employer/contracts/new' : (!isAuthenticated ? '/auth/signup' : undefined),
                linkText: isAuthenticated ? 'Create Contract' : 'Get Started',
              },
              {
                icon: ClipboardCheck,
                color: 'bg-purple-50 text-purple-600',
                title: 'AI Technical Assessments',
                description: 'Create and send coding assessments powered by AI. Evaluate candidates across languages and frameworks in real-time with live scoring.',
                link: isAuthenticated && user?.role === 'BusinessOwner' ? '/test-candidate' : (!isAuthenticated ? '/auth/signup' : undefined),
                linkText: isAuthenticated ? 'Create Assessment' : 'Get Started',
              },
              {
                icon: Shield,
                color: 'bg-blue-50 text-blue-600',
                title: 'Escrow Payment Protection',
                description: 'Every payment is held safely in escrow until work is approved. Both parties are protected from day one, automatically.',
              },
              {
                icon: GitBranch,
                color: 'bg-orange-50 text-orange-600',
                title: 'GitHub Profile Analysis',
                description: 'Deep-dive into any developer\'s GitHub with AI. See real skills, contribution patterns, language proficiency, and coding quality.',
              },
              {
                icon: Receipt,
                color: 'bg-blue-50 text-blue-600',
                title: 'Lowest Fees in the Industry',
                description: 'Just 3.6% for freelancers and 1.9% for clients. No hidden charges, no tiered pricing, no surprises. Keep more of what you earn.',
              },
            ].map(({ icon: Icon, color, title, description, link, linkText }) => (
              <div key={title} className="group bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-heading-sm text-gray-900 mb-2">{title}</h3>
                <p className="text-body-sm text-gray-500 leading-relaxed mb-4">{description}</p>
                {link && (
                  <Link to={link} className="inline-flex items-center text-body-sm text-blue-600 hover:text-blue-700 font-medium transition-colors group/link">
                    {linkText} <ChevronRight className="w-4 h-4 ml-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── "Get paid on time" Escrow Section ─── */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-caption text-blue-700 font-medium mb-5">
                <Lock className="w-3.5 h-3.5" />
                Payment Protection
              </div>
              <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight leading-tight">
                Get paid on time.<br />Every time. <span className="text-emerald-600">Guaranteed.</span>
              </h2>
              <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
                Your funds are held safely in escrow until work is delivered. No more chasing invoices, no more payment uncertainty, no more broken promises.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: ShieldCheck, text: 'Funds locked in escrow before work begins', color: 'text-blue-600' },
                  { icon: Clock, text: 'Automatic payment release on milestone approval', color: 'text-blue-600' },
                  { icon: HandCoins, text: 'Instant withdrawals to your bank account', color: 'text-blue-600' },
                  { icon: FileCheck2, text: 'Dispute resolution built into every contract', color: 'text-blue-600' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <span className="text-body text-gray-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual escrow flow */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-gray-50 rounded-3xl border border-gray-200 p-6 sm:p-8">
              <div className="space-y-4">
                {[
                  { step: 1, icon: FileText, label: 'Contract Created', desc: 'Terms agreed by both parties', color: 'bg-blue-600' },
                  { step: 2, icon: Lock, label: 'Funds Locked in Escrow', desc: 'Client deposits payment securely', color: 'bg-emerald-600' },
                  { step: 3, icon: Send, label: 'Work Delivered', desc: 'Freelancer submits milestone', color: 'bg-blue-600' },
                  { step: 4, icon: BadgeCheck, label: 'Client Approves', desc: 'Work reviewed and accepted', color: 'bg-blue-600' },
                  { step: 5, icon: Wallet, label: 'Payment Released', desc: 'Instant payout to freelancer', color: 'bg-blue-600' },
                ].map(({ step, icon: Icon, label, desc, color }, idx) => (
                  <div key={step} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 ${color} text-white rounded-xl flex items-center justify-center shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {idx < 4 && <div className="w-px h-6 bg-gray-200 mt-1" />}
                    </div>
                    <div className="pt-1.5">
                      <p className="text-subheading text-gray-900">{label}</p>
                      <p className="text-caption text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Earnings Comparison ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-caption text-blue-700 font-medium mb-5">
              <Wallet className="w-3.5 h-3.5" />
              Keep More Money
            </div>
            <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight">
              Tired of platforms<br /><span className="text-blue-600">eating your earnings?</span>
            </h2>
            <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
              See how much more you keep with Artemis vs other platforms on a $1,000 contract.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
            {/* Upwork */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
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
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
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
            <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-300 p-6 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                Best Value
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-caption text-emerald-700 font-medium uppercase tracking-wider mb-1">On Artemis</p>
              <p className="text-display-sm font-bold text-gray-900">$964</p>
              <p className="text-caption text-emerald-600 font-semibold mt-1">You keep 96.4%</p>
              <div className="mt-4 h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96.4%' }} />
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-caption text-blue-700 font-medium mb-5">
              <BarChart3 className="w-3.5 h-3.5" />
              Platform Comparison
            </div>
            <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight">
              Enjoy low fees.<br />Work safely <span className="text-emerald-600">without overpaying.</span>
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
                    <span className="text-caption text-emerald-700 font-bold uppercase tracking-wider">Artemis</span>
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
                    <td className="py-3.5 text-center">{renderComparisonCell(upwork)}</td>
                    <td className="py-3.5 text-center">{renderComparisonCell(fiverr)}</td>
                    <td className="py-3.5 text-center bg-emerald-50/50">{renderComparisonCell(artemis, true)}</td>
                    <td className="py-3.5 text-center">{renderComparisonCell(paper)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-caption text-blue-600 font-semibold uppercase tracking-wider">How It Works</span>
            <h2 className="mt-3 text-display-sm sm:text-display text-gray-900 tracking-tight">
              From discovery to payment in <span className="text-blue-600">3 steps</span>
            </h2>
            <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
              Find verified talent, agree on terms, and let the platform handle the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Discover & Verify Talent',
                description: 'Browse AI-ranked developers on the leaderboard. Review GitHub analysis, skill scores, and coding assessments before you hire.',
                icon: TrendingUp,
                color: 'bg-blue-600',
              },
              {
                step: '02',
                title: 'Create a Smart Contract',
                description: 'Set milestones, budget, and terms. Funds are secured in escrow automatically. Both parties are protected from the start.',
                icon: FileText,
                color: 'bg-blue-600',
              },
              {
                step: '03',
                title: 'Deliver, Approve & Pay',
                description: 'Work gets submitted, reviewed, and approved. Payment releases instantly with the lowest fees in the industry.',
                icon: BadgeCheck,
                color: 'bg-blue-600',
              },
            ].map(({ step, title, description, icon: Icon, color }, idx) => (
              <div key={step} className="relative">
                {/* Connector line (desktop only) */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gray-200" />
                )}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 text-center relative hover:shadow-md hover:border-gray-300 transition-all duration-200">
                  <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md shadow-blue-200/40`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-overline text-blue-600 mb-2 block">STEP {step}</span>
                  <h3 className="text-heading-sm text-gray-900 mb-2">{title}</h3>
                  <p className="text-body-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Switch to Artemis CTA ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-caption text-blue-700 font-medium mb-5">
                <Target className="w-3.5 h-3.5" />
                Why Artemis
              </div>
              <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight leading-tight">
                One platform for<br /><span className="text-emerald-600">the entire workflow.</span>
              </h2>
              <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
                Other platforms do one thing. Artemis does everything: find talent, verify skills, manage contracts, and process payments.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  { icon: ClipboardCheck, text: 'AI-generated coding assessments with live scoring', color: 'text-blue-600' },
                  { icon: GitBranch, text: 'GitHub profile analysis powered by AI', color: 'text-blue-600' },
                  { icon: Shield, text: 'Escrow-protected contracts with milestone tracking', color: 'text-blue-600' },
                  { icon: HandCoins, text: 'Industry-lowest fees: 3.6% freelancer, 1.9% client', color: 'text-blue-600' },
                  { icon: EyeOff, text: 'Total privacy. No public profile required', color: 'text-blue-600' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <span className="text-body text-gray-700">{text}</span>
                  </div>
                ))}
              </div>

              {!isAuthenticated && (
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 !text-white font-semibold h-12 px-8 shadow-lg shadow-blue-200/40">
                    <Link to="/auth/signup">
                      Start Your First Contract <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: 'Secure Escrow', desc: 'Funds protected until work is approved', color: 'bg-blue-50', iconColor: 'text-blue-600' },
                { icon: Zap, title: 'AI Assessments', desc: 'Test skills in real-time with AI scoring', color: 'bg-purple-50', iconColor: 'text-purple-600' },
                { icon: BarChart3, title: 'Skill Analytics', desc: 'GitHub analysis and assessment scorecards', color: 'bg-indigo-50', iconColor: 'text-indigo-600' },
                { icon: Globe, title: 'Global Payments', desc: 'EUR, USD, and local currencies supported', color: 'bg-sky-50', iconColor: 'text-sky-600' },
              ].map(({ icon: Icon, title, desc, color, iconColor }) => (
                <div key={title} className={`${color} rounded-2xl p-5 sm:p-6 border border-gray-100 hover:shadow-md transition-all duration-200`}>
                  <Icon className={`w-6 h-6 ${iconColor} mb-3`} />
                  <h4 className="text-subheading text-gray-900 mb-1">{title}</h4>
                  <p className="text-caption text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social Proof / Stats ─── */}
      <section className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Active Professionals', icon: Users },
              { value: '2M+', label: 'Contracts Processed', icon: Briefcase },
              { value: '98%', label: 'Client Satisfaction', icon: Star },
              { value: '30+', label: 'Countries Served', icon: Globe },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-display-sm sm:text-display font-bold text-gray-900">{value}</p>
                <p className="text-caption text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-display-sm sm:text-display text-white tracking-tight">
              You just need a <span className="underline decoration-blue-300 underline-offset-4">smarter platform.</span>
            </h2>
            <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
              AI assessments, GitHub analysis, smart contracts, escrow payments, and the lowest fees, all in one place. Start building your team today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 !text-white font-semibold h-12 px-8 shadow-lg">
                <Link to="/auth/signup">
                  Start Free Today <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white text-gray-900 border-white hover:bg-blue-50 h-12 px-8 font-medium">
                <Link to="/leaderboard">
                  Explore Leaderboard
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <span className="flex items-center gap-2 text-heading-sm font-semibold text-white"><Target className="w-5 h-5 text-blue-400" />Artemis</span>
              <p className="mt-3 text-body-sm text-gray-400 leading-relaxed">
                The complete remote work platform for Employers and Freelancers. Find talent, manage contracts, and handle payments, all in one place.
              </p>
            </div>
            <div>
              <h4 className="text-caption text-gray-300 font-semibold uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2.5">
                <li><Link to="/leaderboard" className="text-body-sm text-gray-400 hover:text-white transition-colors">Leaderboard</Link></li>
                {!isAuthenticated && <li><Link to="/auth/signup" className="text-body-sm text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>}
                {isAuthenticated && <li><Link to={getDashboardLink()} className="text-body-sm text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>}
              </ul>
            </div>
            <div>
              <h4 className="text-caption text-gray-300 font-semibold uppercase tracking-wider mb-4">Features</h4>
              <ul className="space-y-2.5">
                <li><a href="#features" className="text-body-sm text-gray-400 hover:text-white transition-colors">Talent Search</a></li>
                <li><a href="#features" className="text-body-sm text-gray-400 hover:text-white transition-colors">Contracts</a></li>
                <li><a href="#features" className="text-body-sm text-gray-400 hover:text-white transition-colors">Assessments</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-caption text-gray-300 font-semibold uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><span className="text-body-sm text-gray-500">Privacy Policy</span></li>
                <li><span className="text-body-sm text-gray-500">Terms of Service</span></li>
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
};

export default Index;
