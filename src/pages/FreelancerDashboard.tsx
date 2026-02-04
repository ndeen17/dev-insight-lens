import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Archive, 
  DollarSign, 
  User,
  LogOut,
  BarChart3
} from 'lucide-react';

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
  const { user, logout } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/contracts?role=contributor`);
      setContracts(response.data.contracts);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      draft: { variant: 'secondary', label: 'Draft' },
      pending: { variant: 'default', label: 'Pending' },
      active: { variant: 'default', label: 'Active' },
      completed: { variant: 'default', label: 'Completed' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      disputed: { variant: 'destructive', label: 'Disputed' },
      archived: { variant: 'secondary', label: 'Archived' }
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filterContracts = (status?: string) => {
    if (!status || status === 'all') return contracts;
    if (status === 'ongoing') return contracts.filter(c => ['pending', 'active'].includes(c.status));
    return contracts.filter(c => c.status === status);
  };

  const calculateEarnings = () => {
    const completed = contracts.filter(c => c.status === 'completed');
    const total = completed.reduce((sum, c) => {
      if (c.contractType === 'fixed' && c.budget) {
        return sum + c.budget;
      }
      return sum;
    }, 0);
    return total;
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/signin');
  };

  const stats = {
    active: contracts.filter(c => c.status === 'active').length,
    pending: contracts.filter(c => c.status === 'pending').length,
    completed: contracts.filter(c => c.status === 'completed').length,
    totalEarnings: calculateEarnings()
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Artemis</h1>
            <p className="text-sm text-muted-foreground">Freelancer Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigate('/freelancer/profile')}>
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-3xl font-bold">{stats.active}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-500" />
                <span className="text-3xl font-bold">{stats.pending}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-3xl font-bold">{stats.completed}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-3xl font-bold">${stats.totalEarnings.toFixed(0)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts List */}
        <Card>
          <CardHeader>
            <CardTitle>My Contracts</CardTitle>
            <CardDescription>Manage your ongoing and past projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filterContracts(activeTab).length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No contracts found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filterContracts(activeTab).map((contract) => (
                      <Card key={contract._id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/freelancer/contracts/${contract._id}`)}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{contract.contractName}</h3>
                                {getStatusBadge(contract.status)}
                              </div>
                              
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>Client: {contract.creator.firstName} {contract.creator.lastName} 
                                  {contract.creator.companyName && ` (${contract.creator.companyName})`}
                                </p>
                                <p>Category: {contract.category}</p>
                                <p>Created: {new Date(contract.createdAt).toLocaleDateString()}</p>
                              </div>

                              {contract.milestones && contract.milestones.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium mb-1">Milestones:</p>
                                  <div className="flex gap-2 flex-wrap">
                                    {contract.milestones.map((milestone, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {milestone.name} - {milestone.status}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {contract.contractType === 'fixed' && contract.budget && (
                                  `$${contract.budget.toFixed(2)}`
                                )}
                                {contract.contractType === 'hourly' && contract.hourlyRate && (
                                  `$${contract.hourlyRate}/hr`
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground capitalize">{contract.contractType}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/leaderboard')}>
            <CardContent className="pt-6">
              <BarChart3 className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">View Leaderboard</h3>
              <p className="text-sm text-muted-foreground">See how you rank among other developers</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/freelancer/profile')}>
            <CardContent className="pt-6">
              <User className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Update Profile</h3>
              <p className="text-sm text-muted-foreground">Manage your account settings</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/')}>
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Evaluate Profile</h3>
              <p className="text-sm text-muted-foreground">Get your GitHub profile evaluated</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FreelancerDashboard;
