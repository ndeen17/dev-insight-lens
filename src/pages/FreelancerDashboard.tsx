import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { apiClient } from '@/lib/apiClient';
import { useNotifications } from '@/contexts/NotificationContext';
import DashboardLayout from '../components/DashboardLayout';
import FilterTabs from '../components/FilterTabs';
import ContractCard from '../components/ContractCard';
import EmptyState from '../components/EmptyState';
import { FileText, Inbox, Wallet, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Contract } from '@/types/contract';
import { ROUTES } from '@/config/constants';

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const { toast } = useToast();

  // Get filter from URL params (default: 'pending')
  const activeFilter = searchParams.get('filter') || 'pending';

  // Filter tabs for contracts
  const filterTabs = [
    { id: 'all', label: 'All Contracts', count: contracts.length },
    { 
      id: 'pending', 
      label: 'Pending Offers', 
      count: contracts.filter(c => c.status?.toLowerCase() === 'pending').length 
    },
    { 
      id: 'active', 
      label: 'Active', 
      count: contracts.filter(c => c.status?.toLowerCase() === 'active').length 
    },
    { 
      id: 'rejected', 
      label: 'Declined', 
      count: contracts.filter(c => c.status?.toLowerCase() === 'rejected').length 
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      count: contracts.filter(c => c.status?.toLowerCase() === 'completed').length 
    },
    { 
      id: 'archived', 
      label: 'Archived', 
      count: contracts.filter(c => c.status?.toLowerCase() === 'archived').length 
    },
  ];

  useEffect(() => {
    fetchContracts();
    fetchBalance();
  }, []);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/payments/balance');
      setBalance(response.data.balance || 0);
      setTotalEarnings(response.data.totalEarnings || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, []);

  const fetchContracts = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/contracts?role=contributor');
      setContracts(response.data.contracts || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contracts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Real-time refresh: refetch when we receive a contract-related notification
  const { notifications } = useNotifications();
  useEffect(() => {
    const latest = notifications[0];
    if (
      latest &&
      ['contract_invitation', 'contract_accepted', 'contract_rejected', 'contract_completed', 'milestone_submitted', 'milestone_approved', 'milestone_rejected', 'milestone_paid', 'payment_failed'].includes(latest.type)
    ) {
      fetchContracts();
    }
  }, [notifications, fetchContracts]);

  // Filter contracts based on active filter
  const getFilteredContracts = () => {
    if (activeFilter === 'all') return contracts;
    return contracts.filter(c => c.status?.toLowerCase() === activeFilter);
  };

  const filteredContracts = getFilteredContracts();

  // Handle filter change
  const handleFilterChange = (filterId: string) => {
    setSearchParams({ filter: filterId });
  };

  if (loading) {
    return (
      <DashboardLayout userRole="Freelancer">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="Freelancer">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Contracts</h1>
          <p className="text-gray-600 mt-1">Track your ongoing and past projects</p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-8 pt-6">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-medium">Available Balance</p>
                <p className="text-2xl font-bold text-emerald-900">${balance.toFixed(2)}</p>
                <p className="text-xs text-emerald-500 mt-0.5">Total earned: ${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(ROUTES.WITHDRAWALS)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Withdrawals
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-8 py-6">
        <FilterTabs 
          tabs={filterTabs}
          activeTab={activeFilter}
          onTabChange={handleFilterChange}
        />
      </div>

      {/* Content Area */}
      <div className="px-8 pb-8">
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
              <ContractCard 
                key={contract._id} 
                contract={contract}
                userRole="Freelancer"
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FreelancerDashboard;
