import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { apiClient } from '@/lib/apiClient';
import DashboardLayout from '../components/DashboardLayout';
import FilterTabs from '../components/FilterTabs';
import ContractCard from '../components/ContractCard';
import EmptyState from '../components/EmptyState';
import { FileText, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contract {
  _id: string;
  contractName: string;
  creator: {
    firstName: string;
    lastName: string;
    email: string;
    companyName?: string;
  };
  category: string;
  contractType: 'fixed' | 'hourly';
  budget?: number;
  hourlyRate?: number;
  currency: string;
  status: string;
  createdAt: string;
  milestones?: Array<{
    name: string;
    budget: number;
    status: string;
  }>;
}

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await apiClient.get('/api/contracts?role=contributor');
      setContracts(response.data.contracts);
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
  };

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
                contract={{
                  _id: contract._id,
                  contractName: contract.contractName,
                  description: undefined,
                  budget: contract.budget,
                  status: contract.status,
                  businessOwnerEmail: contract.creator.email,
                  createdAt: contract.createdAt,
                  milestones: contract.milestones?.map(m => ({
                    title: m.name,
                    amount: m.budget,
                    status: m.status
                  }))
                }}
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
