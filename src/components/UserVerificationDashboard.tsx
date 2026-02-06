import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

interface UserStats {
  total: {
    users: number;
    verified: number;
    unverified: number;
    verificationRate: string;
  };
  freelancers: {
    total: number;
    verified: number;
    unverified: number;
    verificationRate: string;
  };
  businessOwners: {
    total: number;
    verified: number;
    unverified: number;
    verificationRate: string;
  };
}

interface User {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Freelancer' | 'BusinessOwner';
  country: string;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

const UserVerificationDashboard = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [unverifiedUsers, setUnverifiedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, unverifiedResponse] = await Promise.all([
        apiClient.get('/api/admin/stats'),
        apiClient.get('/api/admin/users/unverified?limit=10')
      ]);

      setStats(statsResponse.data.stats);
      setUnverifiedUsers(unverifiedResponse.data.users);
    } catch (err: any) {
      console.error('Error fetching verification data:', err);
      setError(err.response?.data?.message || 'Failed to load verification data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Verification Dashboard</h2>
        <p className="text-muted-foreground">Track email verification status across all users</p>
      </div>

      {/* Overall Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.users}</div>
            <p className="text-xs text-muted-foreground">Active accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.total.verified}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total.verificationRate}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unverified Users</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.total.unverified}</div>
            <p className="text-xs text-muted-foreground">Pending verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total.verificationRate}%</div>
            <p className="text-xs text-muted-foreground">Overall platform</p>
          </CardContent>
        </Card>
      </div>

      {/* Role-based Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Freelancers</CardTitle>
            <CardDescription>Developer verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Freelancers</span>
              <span className="font-bold">{stats.freelancers.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Verified
              </span>
              <span className="font-bold text-green-600">{stats.freelancers.verified}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-600 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Unverified
              </span>
              <span className="font-bold text-orange-600">{stats.freelancers.unverified}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verification Rate</span>
                <Badge variant="secondary">{stats.freelancers.verificationRate}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Owners</CardTitle>
            <CardDescription>Employer verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Business Owners</span>
              <span className="font-bold">{stats.businessOwners.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Verified
              </span>
              <span className="font-bold text-green-600">{stats.businessOwners.verified}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-600 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Unverified
              </span>
              <span className="font-bold text-orange-600">{stats.businessOwners.unverified}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verification Rate</span>
                <Badge variant="secondary">{stats.businessOwners.verificationRate}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Unverified Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Unverified Users</CardTitle>
          <CardDescription>Users pending email verification (last 10)</CardDescription>
        </CardHeader>
        <CardContent>
          {unverifiedUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              All users are verified! 🎉
            </p>
          ) : (
            <div className="space-y-4">
              {unverifiedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <Badge variant={user.role === 'Freelancer' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Signed up: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <XCircle className="h-3 w-3 mr-1" />
                    Unverified
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserVerificationDashboard;
