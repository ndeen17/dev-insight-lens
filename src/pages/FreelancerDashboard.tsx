import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { useNotifications } from '@/contexts/NotificationContext';
import { getDashboardStats } from '@/services/dashboardService';
import DashboardLayout from '../components/DashboardLayout';
import FilterTabs from '../components/FilterTabs';
import ContractCard from '../components/ContractCard';
import EmptyState from '../components/EmptyState';
import {
  FileText,
  Inbox,
  Wallet,
  ArrowUpRight,
  Github,
  ClipboardCheck,
  Briefcase,
  TrendingUp,
  Award,
  DollarSign,
  Trophy,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Contract } from '@/types/contract';
import type { FreelancerDashboardStats } from '@/types/dashboard';
import { ROUTES } from '@/config/constants';

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const { user: authUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [stats, setStats] = useState<FreelancerDashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const { toast } = useToast();

  const activeFilter = searchParams.get('filter') || 'all';

  const filterTabs = [
    { id: 'all', label: 'All Contracts', count: contracts.length },
    { id: 'pending', label: 'Pending Offers', count: contracts.filter(c => c.status?.toLowerCase() === 'pending').length },
    { id: 'active', label: 'Active', count: contracts.filter(c => c.status?.toLowerCase() === 'active').length },
    { id: 'rejected', label: 'Declined', count: contracts.filter(c => c.status?.toLowerCase() === 'rejected').length },
    { id: 'completed', label: 'Completed', count: contracts.filter(c => c.status?.toLowerCase() === 'completed').length },
    { id: 'archived', label: 'Archived', count: contracts.filter(c => c.status?.toLowerCase() === 'archived').length },
  ];

  useEffect(() => {
    fetchContracts();
    fetchBalance();
    fetchStats();
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const data = await getDashboardStats();
      if (data.role === 'Freelancer') setStats(data);
    } catch {
      /* non-critical */
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/payments/balance');
      setBalance(response.data.balance || 0);
      setTotalEarnings(response.data.totalEarnings || 0);
    } catch {
      /* tolerate */
    }
  }, []);

  const fetchContracts = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/contracts?role=contributor');
      setContracts(response.data.contracts || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load contracts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const { notifications } = useNotifications();
  useEffect(() => {
    const latest = notifications[0];
    if (
      latest &&
      ['contract_invitation', 'contract_accepted', 'contract_rejected', 'contract_completed', 'milestone_submitted', 'milestone_approved', 'milestone_rejected', 'milestone_paid', 'payment_failed'].includes(latest.type)
    ) {
      fetchContracts();
      fetchStats();
    }
  }, [notifications, fetchContracts, fetchStats]);

  const filteredContracts =
    activeFilter === 'all' ? contracts : contracts.filter(c => c.status?.toLowerCase() === activeFilter);

  const handleFilterChange = (filterId: string) => setSearchParams({ filter: filterId });

  const fmtCurrency = (v: number) =>
    v >= 1000 ? `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `$${v.toFixed(2)}`;

  const greeting = clerkUser?.firstName ? `Welcome back, ${clerkUser.firstName}` : 'Welcome back';

  if (loading) {
    return (
      <DashboardLayout userRole="Freelancer">
        <SkeletonDashboard />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="Freelancer">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="pl-10 md:pl-0">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{greeting}</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            {authUser?.profession
              ? `${authUser.profession}${authUser.professionalRole ? ` · ${authUser.professionalRole}` : ''}`
              : 'Track your projects and earnings'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Contracts"
            value={stats?.contracts.active ?? 0}
            icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            bg="bg-emerald-50"
            loading={loadingStats}
          />
          <StatCard
            label="Pending Offers"
            value={stats?.contracts.pending ?? 0}
            icon={<Inbox className="w-5 h-5 text-blue-600" />}
            bg="bg-blue-50"
            loading={loadingStats}
          />
          <StatCard
            label="Available Balance"
            value={fmtCurrency(balance)}
            sub={`Total earned: ${fmtCurrency(totalEarnings)}`}
            icon={<Wallet className="w-5 h-5 text-amber-600" />}
            bg="bg-amber-50"
            loading={loadingStats}
          />
          <StatCard
            label="Best Score"
            value={stats?.assessments.bestScore ?? '—'}
            sub={stats?.assessments.avgScore ? `Avg: ${stats.assessments.avgScore} · ${stats.assessments.completed} tests` : undefined}
            icon={<Award className="w-5 h-5 text-purple-600" />}
            bg="bg-purple-50"
            loading={loadingStats}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Balance / Withdrawals */}
          <button
            onClick={() => navigate(ROUTES.WITHDRAWALS)}
            className="flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-900">Withdrawals</p>
              <p className="text-xs text-emerald-600">Manage your earnings &amp; payouts</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-300 group-hover:text-emerald-500 transition-colors" />
          </button>

          {/* Skills / GitHub or Assessments */}
          {authUser?.profession === 'Software Engineering' ? (
            <button
              onClick={() => navigate(authUser?.githubUsername ? ROUTES.LEADERBOARD : ROUTES.FREELANCER_ONBOARDING)}
              className="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Github className="w-5 h-5 text-gray-700" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {authUser?.githubUsername ? 'GitHub Leaderboard' : 'Link GitHub'}
                </p>
                <p className="text-xs text-gray-500">
                  {authUser?.githubUsername ? 'View your rank & skills card' : 'Unlock your developer profile'}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
          ) : authUser?.profession ? (
            <button
              onClick={() => navigate(ROUTES.ASSESSMENT_INVITATIONS)}
              className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-blue-900">My Assessments</p>
                <p className="text-xs text-blue-600">View invitations &amp; results</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-blue-300 group-hover:text-blue-500 transition-colors" />
            </button>
          ) : null}

          {/* Leaderboard */}
          <button
            onClick={() => navigate(ROUTES.LEADERBOARD)}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">Leaderboard</p>
              <p className="text-xs text-gray-500">See top-rated professionals</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* Contracts Section */}
      <div className="px-4 sm:px-8 pt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contracts</h2>
        <FilterTabs tabs={filterTabs} activeTab={activeFilter} onTabChange={handleFilterChange} />
      </div>

      <div className="px-4 sm:px-8 py-6 pb-8">
        {filteredContracts.length === 0 ? (
          <EmptyState
            icon={activeFilter === 'pending' ? <Inbox className="w-12 h-12" /> : <FileText className="w-12 h-12" />}
            title={
              activeFilter === 'all'
                ? 'No contracts yet'
                : activeFilter === 'pending'
                  ? 'No pending offers'
                  : `No ${activeFilter} contracts`
            }
            description={
              activeFilter === 'all'
                ? 'Contract offers from clients will appear here'
                : activeFilter === 'pending'
                  ? 'New contract offers will appear here. Check back soon!'
                  : `You don't have any ${activeFilter} contracts at the moment`
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredContracts.map((contract) => (
              <ContractCard key={contract._id} contract={contract} userRole="Freelancer" />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/* ── Sub-components ────────────────────────────────────────── */

function StatCard({
  label,
  value,
  sub,
  icon,
  bg,
  loading,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  bg: string;
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 animate-scale-in">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {loading ? (
          <div className="h-7 w-16 bg-gray-100 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        )}
        {sub && !loading && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default FreelancerDashboard;
