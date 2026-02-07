import { useState, useEffect, useMemo } from 'react';
import { getLeaderboard, getLeaderboardStats } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { 
  Briefcase, 
  Trophy, 
  ArrowLeft, 
  Search, 
  ChevronDown,
  Medal,
  Crown,
  Star,
  Globe,
  Users,
  BarChart3,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { SkeletonLeaderboardRow } from '../components/Skeletons';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    level: '',
    limit: 100
  });

  const isBusinessOwner = user?.role === 'BusinessOwner';

  const handleHire = (developerEmail: string, developerName: string) => {
    if (!user) {
      navigate('/auth/signin', { state: { from: '/leaderboard' } });
      return;
    }
    if (user.role !== 'BusinessOwner') {
      alert('Only business owners can hire developers. Please sign in with a business owner account.');
      return;
    }
    navigate('/employer/contracts/new', {
      state: { freelancerEmail: developerEmail, freelancerName: developerName }
    });
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchStats();
  }, [filters]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const result = await getLeaderboard(filters);
      setLeaderboard(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await getLeaderboardStats();
      setStats(result.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Client-side search filtering
  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery.trim()) return leaderboard;
    const q = searchQuery.toLowerCase();
    return leaderboard.filter((dev) =>
      dev.name?.toLowerCase().includes(q) ||
      dev.username?.toLowerCase().includes(q) ||
      dev.primary_languages?.some((l: string) => l.toLowerCase().includes(q))
    );
  }, [leaderboard, searchQuery]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Senior': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Beginner': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-purple-700 bg-purple-50';
    if (score >= 75) return 'text-emerald-700 bg-emerald-50';
    if (score >= 60) return 'text-blue-700 bg-blue-50';
    return 'text-gray-700 bg-gray-50';
  };

  const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md shadow-amber-200/60">
        <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
    );
    if (rank === 2) return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-md shadow-gray-200/60">
        <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
    );
    if (rank === 3) return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-md shadow-amber-300/40">
        <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
    );
    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center">
        <span className="text-body-sm sm:text-body font-semibold text-gray-500">#{rank}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top nav bar */}
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-heading-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                Artemis
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-body text-gray-500">Leaderboard</span>
            </div>
            <Link to="/" className="text-body-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className="bg-gradient-to-b from-blue-50/80 via-white to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 border border-blue-200/60 flex items-center justify-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-display-sm sm:text-display text-gray-900 tracking-tight">
                Developer Leaderboard
              </h1>
            </div>
          </div>
          <p className="text-body sm:text-lg text-gray-500 mt-2 max-w-xl">
            Top professionals ranked by comprehensive skill assessment and GitHub activity
          </p>

          {/* Stats bar */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
              {[
                { icon: Users, value: stats.total_users, label: 'Developers' },
                { icon: Star, value: stats.by_level?.Expert || 0, label: 'Experts' },
                { icon: BarChart3, value: Math.round(stats.average_score), label: 'Avg Score' },
                { icon: Globe, value: stats.top_countries?.length || 0, label: 'Countries' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-caption text-gray-500 uppercase tracking-wider">{label}</span>
                  </div>
                  <span className="text-heading sm:text-display-sm text-gray-900 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search & Filters bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, username, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-body-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            {/* Filters */}
            <div className="flex gap-2 sm:gap-3">
              <div className="relative">
                <select 
                  value={filters.country} 
                  onChange={(e) => setFilters({...filters, country: e.target.value})}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-body-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all"
                >
                  <option value="">All Countries</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="IN">India</option>
                  <option value="NG">Nigeria</option>
                  <option value="CA">Canada</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="BR">Brazil</option>
                  <option value="AU">Australia</option>
                  <option value="CN">China</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select 
                  value={filters.level} 
                  onChange={(e) => setFilters({...filters, level: e.target.value})}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-body-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all"
                >
                  <option value="">All Levels</option>
                  <option value="Expert">Expert</option>
                  <option value="Senior">Senior</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Beginner">Beginner</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative hidden sm:block">
                <select 
                  value={filters.limit} 
                  onChange={(e) => setFilters({...filters, limit: parseInt(e.target.value)})}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-body-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all"
                >
                  <option value="10">Top 10</option>
                  <option value="25">Top 25</option>
                  <option value="50">Top 50</option>
                  <option value="100">Top 100</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          {/* Active filter count */}
          {(searchQuery || filters.country || filters.level) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-caption text-gray-500">
                Showing {filteredLeaderboard.length} of {leaderboard.length} developers
              </span>
              <button
                onClick={() => { setSearchQuery(''); setFilters({ country: '', level: '', limit: 100 }); }}
                className="text-caption text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <div className="space-y-3 animate-fade-in-up">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonLeaderboardRow key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-body text-red-600 mb-4">{error}</p>
            <Button 
              onClick={fetchLeaderboard}
              variant="destructive"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        ) : filteredLeaderboard.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-body text-gray-600 font-medium mb-1">No developers found</p>
            <p className="text-body-sm text-gray-400 mb-4">Try adjusting your search or filters</p>
            <Button 
              onClick={() => { setSearchQuery(''); setFilters({ country: '', level: '', limit: 100 }); }}
              variant="outline"
              size="sm"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table header — desktop only */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-2.5 text-overline text-gray-400 uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Developer</div>
              <div className="col-span-3">Skills</div>
              <div className="col-span-1 text-center">Score</div>
              <div className="col-span-1 text-center">Level</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {filteredLeaderboard.map((dev, idx) => (
              <div 
                key={dev.username} 
                className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-fade-in-up ${
                  dev.rank <= 3 ? 'border-blue-100 shadow-sm' : 'border-gray-200'
                }`}
                style={{ animationDelay: `${Math.min(idx, 10) * 40}ms` }}
              >
                {/* Mobile layout */}
                <div className="lg:hidden p-4">
                  <div className="flex items-center gap-3">
                    <RankBadge rank={dev.rank} />
                    <img 
                      src={dev.avatar} 
                      alt={dev.name} 
                      className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-semibold text-gray-900 truncate">{dev.name}</p>
                      <a 
                        href={`https://github.com/${dev.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-caption text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        @{dev.username} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-right">
                      <span className={`text-heading-sm font-semibold ${getScoreColor(dev.overall_score)} px-2 py-0.5 rounded-lg`}>
                        {dev.overall_score}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1.5">
                      {dev.primary_languages?.slice(0, 3).map((lang: string) => (
                        <span key={lang} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-caption rounded-md border border-gray-100">
                          {lang}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-caption font-medium border ${getLevelColor(dev.overall_level)}`}>
                        {dev.overall_level}
                      </span>
                      {isBusinessOwner && (
                        <Button
                          onClick={() => handleHire(dev.email || `${dev.username}@github.com`, dev.name)}
                          size="sm"
                          className="h-7 px-2.5 text-caption bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Briefcase className="w-3 h-3 mr-1" />
                          Hire
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop layout — table-like row */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center px-6 py-4">
                  <div className="col-span-1">
                    <RankBadge rank={dev.rank} />
                  </div>
                  <div className="col-span-5 flex items-center gap-3">
                    <img 
                      src={dev.avatar} 
                      alt={dev.name} 
                      className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-body font-semibold text-gray-900 truncate">{dev.name}</p>
                      <a 
                        href={`https://github.com/${dev.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-caption text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                      >
                        @{dev.username} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-1.5">
                      {dev.primary_languages?.slice(0, 4).map((lang: string) => (
                        <span key={lang} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-caption rounded-md border border-gray-100">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className={`text-heading-sm font-semibold ${getScoreColor(dev.overall_score)} px-2.5 py-1 rounded-lg inline-block`}>
                      {dev.overall_score}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-caption font-medium border ${getLevelColor(dev.overall_level)}`}>
                      {dev.overall_level}
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    {isBusinessOwner && (
                      <Button
                        onClick={() => handleHire(dev.email || `${dev.username}@github.com`, dev.name)}
                        size="sm"
                        className="h-8 px-3 text-caption bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Briefcase className="w-3.5 h-3.5 mr-1" />
                        Hire
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-body font-semibold text-gray-900">Artemis</span>
              <span className="text-body-sm text-gray-400">Remote Work Platform</span>
            </div>
            <div className="text-caption text-gray-400 text-center sm:text-right">
              <p>Not affiliated with GitHub, Inc. GitHub is a trademark of GitHub, Inc.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Leaderboard;
