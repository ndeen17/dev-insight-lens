import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ROUTES } from '../config/constants';
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
  BarChart3,
  Star,
  Target,
  Eye,
  EyeOff,
  Sparkles,
  HandCoins,
  ShieldCheck,
  Receipt,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
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

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-lime-50/30 via-lime-50/10 to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <div className="max-w-3xl mx-auto text-center">

            <h1 className="text-display sm:text-[2.75rem] lg:text-[3.25rem] font-bold text-gray-900 tracking-tight leading-[1.15]">
              The smarter way to<br className="hidden sm:block" />
              <span className="inline-block overflow-hidden h-[1.2em] align-bottom">
                <span
                  key={heroIndex}
                  className="inline-block text-lime-500 hero-text-reveal"
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
                  <Button asChild size="lg" className="w-full sm:w-auto bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-12 px-8 text-body shadow-lg shadow-lime-200/50">
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
                <Button asChild size="lg" className="bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-12 px-8 text-body shadow-lg shadow-lime-200/50">
                  <Link to={getDashboardLink()}>
                    Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-caption text-lime-600 font-semibold uppercase tracking-wider">Platform Features</span>
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
                color: 'bg-lime-50 text-lime-600',
                title: 'AI-Ranked Talent Discovery',
                description: 'Browse professionals ranked by verified GitHub skills, assessment scores, and contribution history. No guesswork.',
                featureLink: ROUTES.FEATURE_TALENT_DISCOVERY,
                linkText: 'Learn More',
              },
              {
                icon: FileText,
                color: 'bg-lime-50 text-lime-600',
                title: 'Smart Contracts',
                description: 'Create fixed-price or hourly contracts with milestone tracking, automated approval workflows, and built-in escrow protection.',
                featureLink: ROUTES.FEATURE_SMART_CONTRACTS,
                linkText: 'Learn More',
              },
              {
                icon: ClipboardCheck,
                color: 'bg-lime-50 text-lime-600',
                title: 'AI Technical Assessments',
                description: 'Create and send coding assessments powered by AI. Evaluate candidates across languages and frameworks in real-time with live scoring.',
                featureLink: ROUTES.FEATURE_AI_ASSESSMENTS,
                linkText: 'Learn More',
              },
              {
                icon: Shield,
                color: 'bg-lime-50 text-lime-600',
                title: 'Escrow Payment Protection',
                description: 'Every payment is held safely in escrow until work is approved. Both parties are protected from day one, automatically.',
                featureLink: ROUTES.FEATURE_ESCROW_PAYMENTS,
                linkText: 'Learn More',
              },
              {
                icon: GitBranch,
                color: 'bg-lime-50 text-lime-600',
                title: 'GitHub Profile Analysis',
                description: 'Deep-dive into any developer\'s GitHub with AI. See real skills, contribution patterns, language proficiency, and coding quality.',
                featureLink: ROUTES.FEATURE_GITHUB_ANALYSIS,
                linkText: 'Learn More',
              },
              {
                icon: Receipt,
                color: 'bg-lime-50 text-lime-600',
                title: 'Lowest Fees in the Industry',
                description: 'Just 3.6% for freelancers and 1.9% for clients. No hidden charges, no tiered pricing, no surprises. Keep more of what you earn.',
                featureLink: ROUTES.FEATURE_LOWEST_FEES,
                linkText: 'Learn More',
              },
            ].map(({ icon: Icon, color, title, description, featureLink, linkText }) => (
              <Link key={title} to={featureLink} className="group bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 block cursor-pointer">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-heading-sm text-gray-900 mb-2">{title}</h3>
                <p className="text-body-sm text-gray-500 leading-relaxed mb-4">{description}</p>
                <span className="inline-flex items-center text-body-sm text-lime-600 group-hover:text-lime-700 font-medium transition-colors">
                  {linkText} <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Switch to Artemis CTA ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-50 border border-lime-200 text-caption text-lime-700 font-medium mb-5">
                <Target className="w-3.5 h-3.5" />
                Why Artemis
              </div>
              <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight leading-tight">
                One platform for<br /><span className="text-lime-500">the entire workflow.</span>
              </h2>
              <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
                Other platforms do one thing. Artemis does everything: find talent, verify skills, manage contracts, and process payments.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  { icon: ClipboardCheck, text: 'AI-generated coding assessments with live scoring', color: 'text-lime-600' },
                  { icon: GitBranch, text: 'GitHub profile analysis powered by AI', color: 'text-lime-600' },
                  { icon: Shield, text: 'Escrow-protected contracts with milestone tracking', color: 'text-lime-600' },
                  { icon: HandCoins, text: 'Industry-lowest fees: 3.6% freelancer, 1.9% client', color: 'text-lime-600' },
                  { icon: EyeOff, text: 'Total privacy. No public profile required', color: 'text-lime-600' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-lime-50 flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <span className="text-body text-gray-700">{text}</span>
                  </div>
                ))}
              </div>

              {!isAuthenticated && (
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-12 px-8 shadow-lg shadow-lime-200/40">
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
                { icon: Shield, title: 'Secure Escrow', desc: 'Funds protected until work is approved', color: 'bg-lime-50', iconColor: 'text-lime-600' },
                { icon: Zap, title: 'AI Assessments', desc: 'Test skills in real-time with AI scoring', color: 'bg-lime-50', iconColor: 'text-lime-600' },
                { icon: BarChart3, title: 'Skill Analytics', desc: 'GitHub analysis and assessment scorecards', color: 'bg-lime-50', iconColor: 'text-lime-600' },
                { icon: Globe, title: 'Global Payments', desc: 'EUR, USD, and local currencies supported', color: 'bg-lime-50', iconColor: 'text-lime-600' },
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
                <div className="w-10 h-10 bg-lime-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-lime-600" />
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
        <section className="bg-gray-900 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-display-sm sm:text-display text-white tracking-tight">
              You just need a <span className="underline decoration-lime-400 underline-offset-4">smarter platform.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              AI assessments, GitHub analysis, smart contracts, escrow payments, and the lowest fees, all in one place. Start building your team today.
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

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <span className="flex items-center gap-2 text-heading-sm font-semibold text-white"><Target className="w-5 h-5 text-lime-400" />Artemis</span>
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
};

export default Index;
