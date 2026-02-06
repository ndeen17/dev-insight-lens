import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Clock, CheckCircle2, XCircle, Calendar, User, Mail } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BackToDashboard from '../components/BackToDashboard';

interface TestInvitation {
  id: string;
  candidateName: string;
  candidateEmail: string;
  testType: string;
  sentDate: string;
  expiryDate: string;
  status: 'pending' | 'completed' | 'expired';
  score?: number;
}

export default function TestInvitations() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<TestInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'expired'>('all');

  useEffect(() => {
    // TODO: Fetch invitations from backend
    // Mock data for now
    setTimeout(() => {
      setInvitations([
        {
          id: '1',
          candidateName: 'John Doe',
          candidateEmail: 'john@example.com',
          testType: 'Full Stack Developer',
          sentDate: '2024-01-15',
          expiryDate: '2024-01-22',
          status: 'pending'
        },
        {
          id: '2',
          candidateName: 'Jane Smith',
          candidateEmail: 'jane@example.com',
          testType: 'React Developer',
          sentDate: '2024-01-10',
          expiryDate: '2024-01-17',
          status: 'completed',
          score: 85
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredInvitations = invitations.filter(inv => 
    filter === 'all' || inv.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="BusinessOwner" />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <BackToDashboard />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Test Invitations</h1>
                <p className="mt-2 text-gray-600">
                  Manage and track all developer test invitations
                </p>
              </div>
              <button
                onClick={() => navigate('/test-candidate')}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send className="w-5 h-5" />
                <span>Send New Invitation</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-8">
              {['all', 'pending', 'completed', 'expired'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab as any)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    filter === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100">
                    {tab === 'all' 
                      ? invitations.length 
                      : invitations.filter(inv => inv.status === tab).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Invitations List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredInvitations.length === 0 ? (
            <div className="text-center py-12">
              <Send className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No invitations</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'Get started by sending a test invitation to a candidate.'
                  : `No ${filter} invitations found.`}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/test-candidate')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Test Invitation
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(invitation.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {invitation.candidateName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                          {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{invitation.candidateEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{invitation.testType}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Sent: {new Date(invitation.sentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Expires: {new Date(invitation.expiryDate).toLocaleDateString()}</span>
                        </div>
                        {invitation.score !== undefined && (
                          <div className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Score: {invitation.score}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-6 flex flex-col space-y-2">
                      {invitation.status === 'completed' && (
                        <button
                          onClick={() => navigate(`/test-candidate/${invitation.id}/results`)}
                          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          View Results
                        </button>
                      )}
                      {invitation.status === 'pending' && (
                        <button
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          Resend
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
