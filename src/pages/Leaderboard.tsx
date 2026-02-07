import { useState, useEffect } from 'react';
import { getLeaderboard, getLeaderboardStats } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Briefcase, Trophy, ArrowLeft } from 'lucide-react';
import { SkeletonLeaderboardRow } from '../components/Skeletons';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Senior': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Beginner': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-green-400 to-emerald-500 text-white py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start">
            <Link to="/" className="inline-flex items-center space-x-2 text-white/90 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Analysis</span>
            </Link>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 flex items-center gap-3">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10" /> Developer Leaderboard
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-full md:max-w-2xl">
              Top GitHub developers ranked by comprehensive skill assessment
            </p>

            {/* Stats Cards */}
            {stats && (
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30">
                  <div className="text-2xl sm:text-3xl font-bold">{stats.total_users}</div>
                  <div className="text-xs sm:text-sm text-white/80">Total Developers</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30">
                  <div className="text-2xl sm:text-3xl font-bold">{stats.by_level?.Expert || 0}</div>
                  <div className="text-xs sm:text-sm text-white/80">Experts</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30">
                  <div className="text-2xl sm:text-3xl font-bold">{Math.round(stats.average_score)}</div>
                  <div className="text-xs sm:text-sm text-white/80">Avg Score</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30">
                  <div className="text-2xl sm:text-3xl font-bold">{stats.top_countries?.length || 0}</div>
                  <div className="text-xs sm:text-sm text-white/80">Countries</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Rankings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select 
                value={filters.country} 
                onChange={(e) => setFilters({...filters, country: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
              >
                <option value="">All Countries</option>
                <option value="US">🇺🇸 United States</option>
                <option value="GB">🇬🇧 United Kingdom</option>
                <option value="IN">🇮🇳 India</option>
                <option value="NG">🇳🇬 Nigeria</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="DE">🇩🇪 Germany</option>
                <option value="FR">🇫🇷 France</option>
                <option value="BR">🇧🇷 Brazil</option>
                <option value="AU">🇦🇺 Australia</option>
                <option value="CN">🇨🇳 China</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select 
                value={filters.level} 
                onChange={(e) => setFilters({...filters, level: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
              >
                <option value="">All Levels</option>
                <option value="Expert">Expert</option>
                <option value="Senior">Senior</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Beginner">Beginner</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Show Top</label>
              <select 
                value={filters.limit} 
                onChange={(e) => setFilters({...filters, limit: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
              >
                <option value="10">Top 10</option>
                <option value="25">Top 25</option>
                <option value="50">Top 50</option>
                <option value="100">Top 100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="grid gap-4 animate-fade-in-up">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonLeaderboardRow key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchLeaderboard}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-600 text-lg">No developers found with the selected filters</p>
            <button 
              onClick={() => setFilters({ country: '', level: '', limit: 100 })}
              className="mt-4 px-6 py-2 bg-green-400 text-black font-bold rounded-lg hover:bg-green-500 active:scale-[0.97] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {leaderboard.map((dev) => (
              <div 
                key={dev.username} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-10 sm:w-16 text-center">
                    <div className="text-xl sm:text-3xl font-bold text-gray-400">
                      {getRankMedal(dev.rank) || `#${dev.rank}`}
                    </div>
                  </div>

                  {/* Avatar */}
                  <img 
                    src={dev.avatar} 
                    alt={dev.name} 
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gray-200"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-xl font-bold text-gray-900 truncate">{dev.name}</h3>
                    <a 
                      href={`https://github.com/${dev.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      @{dev.username} ↗
                    </a>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dev.primary_languages?.slice(0, 3).map(lang => (
                        <span key={lang} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Score & Actions */}
                  <div className="flex-shrink-0 text-left sm:text-right space-y-2 sm:space-y-3">
                    <div>
                      <div className="text-2xl sm:text-4xl font-bold text-green-500">
                        {dev.overall_score}
                      </div>
                      <div className="text-sm text-gray-500">/ 110</div>
                      <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(dev.overall_level)}`}>
                        {dev.overall_level}
                      </div>
                    </div>
                    {isBusinessOwner && (
                      <Button
                        onClick={() => handleHire(dev.email || `${dev.username}@github.com`, dev.name)}
                        size="sm"
                        className="w-full gap-1"
                      >
                        <Briefcase className="w-3 h-3" />
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
      <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm mb-3">• Powered by GPT-4</p>
          <div className="text-gray-400 text-xs space-y-1">
            <p>Not affiliated with GitHub, Inc.</p>
            <p>GitHub and the GitHub logo are trademarks of GitHub, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Leaderboard;
