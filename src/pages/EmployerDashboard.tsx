import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { apiClient } from '@/lib/apiClient';
import { useNotifications } from '@/contexts/NotificationContext';
import DashboardLayout from '../components/DashboardLayout';
import FilterTabs from '../components/FilterTabs';
import ContractCard from '../components/ContractCard';
import EmptyState from '../components/EmptyState';
import { FileText, Plus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { ROUTES } from '@/config/constants';
import type { Contract } from '@/types/contract';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const { toast } = useToast();

  // Get filter from URL params (default: 'pending')
  const activeFilter = searchParams.get('filter') || 'pending';

  // Filter tabs for contracts
  const filterTabs = [
    { id: 'all', label: 'All Contracts', count: contracts.length },
    { 
      id: 'pending', 
      label: 'Pending', 
      count: contracts.filter(c => c.status?.toLowerCase() === 'pending').length 
    },
    { 
      id: 'active', 
      label: 'Active', 
      count: contracts.filter(c => c.status?.toLowerCase() === 'active').length 
    },
    { 
      id: 'rejected', 
      label: 'Rejected', 
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

  // Fetch contracts
  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = useCallback(async () => {
    try {
      setLoadingContracts(true);
      const response = await apiClient.get('/api/contracts?role=creator');
      setContracts(response.data.contracts || []);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contracts',
        variant: 'destructive',
      });
    } finally {
      setLoadingContracts(false);
    }
  }, [toast]);

  // Real-time refresh: refetch when we receive a contract-related notification
  const { notifications } = useNotifications();
  useEffect(() => {
    // If newest notification is contract-related, refetch
    const latest = notifications[0];
    if (
      latest &&
      ['contract_accepted', 'contract_rejected', 'contract_completed', 'milestone_submitted', 'milestone_approved', 'milestone_rejected'].includes(latest.type)
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

  // Handle create contract
  const handleCreateContract = () => {
    navigate(ROUTES.CREATE_CONTRACT);
  };

  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
            <p className="text-gray-600 mt-1">Manage all your contracts with freelancers</p>
          </div>
          <button
            onClick={handleCreateContract}
            className="flex items-center space-x-2 px-6 py-3 text-black font-bold bg-green-400 hover:bg-green-500 rounded-lg transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>New Contract</span>
          </button>
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
        {loadingContracts ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredContracts.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title={
              activeFilter === 'all' 
                ? 'No contracts yet' 
                : `No ${activeFilter} contracts`
            }
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
              <ContractCard 
                key={contract._id} 
                contract={contract}
                userRole="BusinessOwner"
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
