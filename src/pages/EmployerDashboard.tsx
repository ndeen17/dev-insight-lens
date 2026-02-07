import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { apiClient } from '@/lib/apiClient';
import { useNotifications } from '@/contexts/NotificationContext';
import { getDashboardStats } from '@/services/dashboardService';
import DashboardLayout from '../components/DashboardLayout';
import FilterTabs from '../components/FilterTabs';
import ContractCard from '../components/ContractCard';
import EmptyState from '../components/EmptyState';
import {
  FileText,
  Plus,
  Users,
  Briefcase,
  DollarSign,
  ClipboardList,
  ArrowUpRight,
  TrendingUp,
  Send,
  User,
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { ROUTES } from '@/config/constants';
import { SkeletonCard } from '@/components/Skeletons';
import type { Contract } from '@/types/contract';
import type { EmployerDashboardStats, RecentSession } from '@/types/dashboard';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [stats, setStats] = useState<EmployerDashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const { toast } = useToast();

  const activeFilter = searchParams.get('filter') || 'all';

  const filterTabs = [
    { id: 'all', label: 'All Contracts', count: contracts.length },
    { id: 'pending', label: 'Pending', count: contracts.filter(c => ['pending', 'draft'].includes(c.status?.toLowerCase())).length },
    { id: 'active', label: 'Active', count: contracts.filter(c => c.status?.toLowerCase() === 'active').length },
    { id: 'rejected', label: 'Rejected', count: contracts.filter(c => c.status?.toLowerCase() === 'rejected').length },
    { id: 'completed', label: 'Completed', count: contracts.filter(c => c.status?.toLowerCase() === 'completed').length },
    { id: 'archived', label: 'Archived', count: contracts.filter(c => c.status?.toLowerCase() === 'archived').length },
  ];

  useEffect(() => {
    fetchContracts();
    fetchStats();
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const data = await getDashboardStats();
      if (data.role === 'BusinessOwner') setStats(data);
    } catch {
      /* stats are non-critical */
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchContracts = useCallback(async () => {
    try {
      setLoadingContracts(true);
      const response = await apiClient.get('/api/contracts?role=creator');
      setContracts(response.data.contracts || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load contracts', variant: 'destructive' });
    } finally {
      setLoadingContracts(false);
    }
  }, [toast]);

  const { notifications } = useNotifications();
  useEffect(() => {
    const latest = notifications[0];
    if (
      latest &&
      ['contract_accepted', 'contract_rejected', 'contract_completed', 'milestone_submitted', 'milestone_approved', 'milestone_rejected'].includes(latest.type)
    ) {
      fetchContracts();
      fetchStats();
    }
  }, [notifications, fetchContracts, fetchStats]);

  const filteredContracts =
    activeFilter === 'all'
      ? contracts
      : activeFilter === 'pending'
        ? contracts.filter(c => ['pending', 'draft'].includes(c.status?.toLowerCase()))
        : contracts.filter(c => c.status?.toLowerCase() === activeFilter);

  const handleFilterChange = (filterId: string) => setSearchParams({ filter: filterId });
  const handleCreateContract = () => navigate(ROUTES.CREATE_CONTRACT, { state: { fresh: true } });

  const fmtCurrency = (v: number) =>
    v >= 1000 ? `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `$${v}`;

  const greeting = user?.firstName ? `Welcome back, ${user.firstName}` : 'Welcome back';

  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 tracking-tight">{greeting}</h1>
            <p className="text-body-sm text-gray-500 mt-0.5">Here&apos;s what&apos;s happening across your workspace</p>
          </div>
          <button
            onClick={handleCreateContract}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-white font-semibold bg-blue-600 hover:bg-blue-700 active:scale-[0.97] rounded-lg transition-all shadow-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Contract</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            label="Browse Talent"
            description="Find and assess professionals"
            icon={<Users className="w-5 h-5" />}
            onClick={() => navigate(ROUTES.BROWSE_TALENT)}
          />
          <QuickAction
            label="Create Assessment"
            description="Build an AI-powered skill test"
            icon={<ClipboardList className="w-5 h-5" />}
            onClick={() => navigate(ROUTES.CREATE_ASSESSMENT)}
          />
          <QuickAction
            label="Send Contract"
            description="Hire a freelancer with a contract"
            icon={<Send className="w-5 h-5" />}
            onClick={handleCreateContract}
          />
        </div>
      </div>

      {/* Recent Assessment Results */}
      {stats && stats.recentSessions.length > 0 && (
        <div className="px-4 sm:px-8 pt-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
              <h2 className="text-subheading text-gray-900">Recent Assessment Results</h2>
              <button
                onClick={() => navigate(ROUTES.EMPLOYER_ASSESSMENTS)}
                className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {stats.recentSessions.map((s) => (
                <SessionRow key={s._id} session={s} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contracts Section */}
      <div className="px-4 sm:px-8 pt-8">
        <h2 className="text-subheading text-gray-900 mb-4">Contracts</h2>
        <FilterTabs tabs={filterTabs} activeTab={activeFilter} onTabChange={handleFilterChange} />
      </div>

      <div className="px-4 sm:px-8 py-6 pb-8">
        {loadingContracts ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredContracts.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title={activeFilter === 'all' ? 'No contracts yet' : `No ${activeFilter} contracts`}
            description={
              activeFilter === 'all'
                ? 'Create your first contract to start working with freelancers'
                : `You don't have any ${activeFilter} contracts at the moment`
            }
            actionLabel={activeFilter === 'all' ? 'Create Contract' : undefined}
            onAction={activeFilter === 'all' ? handleCreateContract : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredContracts.map((contract) => (
              <ContractCard key={contract._id} contract={contract} userRole="BusinessOwner" />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/* ── Sub-components ────────────────────────────────────────── */

function QuickAction({
  label,
  description,
  icon,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-500 transition-colors" />
    </button>
  );
}

function SessionRow({ session }: { session: RecentSession }) {
  const scoreColor =
    session.score >= 80
      ? 'text-emerald-700 bg-emerald-50'
      : session.score >= 60
        ? 'text-amber-700 bg-amber-50'
        : 'text-red-700 bg-red-50';

  const difficultyColor: Record<string, string> = {
    beginner: 'bg-green-50 text-green-700',
    intermediate: 'bg-yellow-50 text-yellow-700',
    advanced: 'bg-red-50 text-red-700',
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {session.freelancer.profilePicture ? (
          <img src={session.freelancer.profilePicture} alt="" className="w-full h-full object-cover" />
        ) : (
          <User className="w-4 h-4 text-gray-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {session.freelancer.firstName} {session.freelancer.lastName}
        </p>
        <p className="text-xs text-gray-500 truncate">{session.assessment.title}</p>
      </div>
      <span
        className={`hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor[session.assessment.difficulty] ?? 'bg-gray-50 text-gray-700'}`}
      >
        {session.assessment.difficulty}
      </span>
      <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${scoreColor}`}>{session.score}</span>
      <span className="hidden sm:inline text-xs text-gray-400 w-20 text-right">
        {new Date(session.completedAt).toLocaleDateString()}
      </span>
    </div>
  );
}

export default EmployerDashboard;
