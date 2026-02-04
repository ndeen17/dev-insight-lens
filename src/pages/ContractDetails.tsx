import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Calendar,
  User,
  AlertCircle,
  Upload,
  Download
} from 'lucide-react';

interface Milestone {
  _id: string;
  name: string;
  budget: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  submission?: {
    description: string;
    submittedAt: string;
    feedback?: string;
  };
}

interface Contract {
  _id: string;
  name: string;
  businessOwner: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName?: string;
  };
  freelancer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  category: string;
  subcategory: string;
  description: string;
  type: 'fixed' | 'hourly';
  budget?: number;
  hourlyRate?: number;
  weeklyLimit?: number;
  currency: string;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed';
  milestones: Milestone[];
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

export default function ContractDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const isBusinessOwner = user?.role === 'BusinessOwner';
  const isFreelancer = user?.role === 'Freelancer';

  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contracts/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contract');
      }

      const data = await response.json();
      setContract(data);
    } catch (err) {
      setError('Failed to load contract');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptContract = async () => {
    try {
      setSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contracts/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'active' })
      });

      if (!response.ok) {
        throw new Error('Failed to accept contract');
      }

      await fetchContract();
    } catch (err) {
      alert('Failed to accept contract');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectContract = async () => {
    try {
      setSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contracts/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) {
        throw new Error('Failed to reject contract');
      }

      navigate('/freelancer/dashboard');
    } catch (err) {
      alert('Failed to reject contract');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitMilestone = async (milestoneId: string) => {
    if (!submissionDescription.trim()) {
      alert('Please provide a submission description');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contracts/${id}/milestones/${milestoneId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            status: 'submitted',
            submissionDescription
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit milestone');
      }

      setSubmissionDescription('');
      setSelectedMilestone(null);
      await fetchContract();
    } catch (err) {
      alert('Failed to submit milestone');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveMilestone = async (milestoneId: string) => {
    try {
      setSubmitting(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contracts/${id}/milestones/${milestoneId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            status: 'approved',
            feedback: feedback || undefined
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to approve milestone');
      }

      setFeedback('');
      await fetchContract();
    } catch (err) {
      alert('Failed to approve milestone');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectMilestone = async (milestoneId: string) => {
    if (!feedback.trim()) {
      alert('Please provide feedback for rejection');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contracts/${id}/milestones/${milestoneId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            status: 'rejected',
            feedback
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reject milestone');
      }

      setFeedback('');
      await fetchContract();
    } catch (err) {
      alert('Failed to reject milestone');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      draft: { variant: 'secondary', label: 'Draft' },
      pending: { variant: 'default', label: 'Pending' },
      active: { variant: 'default', label: 'Active' },
      completed: { variant: 'default', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
      disputed: { variant: 'destructive', label: 'Disputed' }
    };
    
    const config = variants[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getMilestoneStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; icon: any }> = {
      pending: { variant: 'secondary', label: 'Pending', icon: Clock },
      in_progress: { variant: 'default', label: 'In Progress', icon: Clock },
      submitted: { variant: 'default', label: 'Submitted', icon: Upload },
      approved: { variant: 'default', label: 'Approved', icon: CheckCircle2 },
      rejected: { variant: 'destructive', label: 'Rejected', icon: AlertCircle }
    };
    
    const config = variants[status] || { variant: 'secondary', label: status, icon: Clock };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const calculateProgress = () => {
    if (!contract?.milestones?.length) return 0;
    const approved = contract.milestones.filter(m => m.status === 'approved').length;
    return (approved / contract.milestones.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contract...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Contract not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{contract.name}</h1>
              <p className="mt-2 text-gray-600">{contract.category} • {contract.subcategory}</p>
            </div>
            {getStatusBadge(contract.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contract Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-600 mb-2">Description</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{contract.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600 mb-1">Type</h3>
                    <p className="text-gray-900 capitalize">{contract.type} Price</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600 mb-1">
                      {contract.type === 'fixed' ? 'Budget' : 'Hourly Rate'}
                    </h3>
                    <p className="text-gray-900 font-semibold">
                      {contract.currency} {contract.type === 'fixed' ? contract.budget : contract.hourlyRate}
                      {contract.type === 'hourly' && '/hr'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600 mb-1">Created</h3>
                    <p className="text-gray-900">
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {contract.acceptedAt && (
                    <div>
                      <h3 className="font-semibold text-sm text-gray-600 mb-1">Accepted</h3>
                      <p className="text-gray-900">
                        {new Date(contract.acceptedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pending Contract Actions */}
            {contract.status === 'pending' && isFreelancer && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-900">Action Required</CardTitle>
                  <CardDescription className="text-blue-700">
                    Review and accept or reject this contract offer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAcceptContract}
                      disabled={submitting}
                      className="flex-1"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Accept Contract
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" disabled={submitting} className="flex-1">
                          Reject
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Contract?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reject this contract? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRejectContract}>
                            Reject Contract
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Milestones */}
            {contract.milestones && contract.milestones.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Milestones</CardTitle>
                  <CardDescription>
                    Track progress and manage deliverables
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-semibold">{Math.round(calculateProgress())}%</span>
                    </div>
                    <Progress value={calculateProgress()} className="h-2" />
                  </div>

                  {/* Milestone List */}
                  <div className="space-y-4">
                    {contract.milestones.map((milestone) => (
                      <Card key={milestone._id} className="border">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base">{milestone.name}</CardTitle>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  {contract.currency} {milestone.budget}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(milestone.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {getMilestoneStatusBadge(milestone.status)}
                          </div>
                        </CardHeader>

                        {milestone.submission && (
                          <CardContent className="pt-0 space-y-3">
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-sm font-semibold mb-1">Submission</p>
                              <p className="text-sm text-gray-700">{milestone.submission.description}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                Submitted {new Date(milestone.submission.submittedAt).toLocaleDateString()}
                              </p>
                            </div>

                            {milestone.submission.feedback && (
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="text-sm font-semibold mb-1">Feedback</p>
                                <p className="text-sm text-gray-700">{milestone.submission.feedback}</p>
                              </div>
                            )}

                            {/* Business Owner Actions */}
                            {isBusinessOwner && milestone.status === 'submitted' && (
                              <div className="space-y-3 pt-3 border-t">
                                <Textarea
                                  placeholder="Optional feedback..."
                                  value={feedback}
                                  onChange={(e) => setFeedback(e.target.value)}
                                  rows={3}
                                />
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleApproveMilestone(milestone._id)}
                                    disabled={submitting}
                                    className="flex-1"
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleRejectMilestone(milestone._id)}
                                    disabled={submitting || !feedback.trim()}
                                    className="flex-1"
                                  >
                                    Request Changes
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        )}

                        {/* Freelancer Submit Action */}
                        {isFreelancer && 
                         contract.status === 'active' &&
                         (milestone.status === 'pending' || milestone.status === 'in_progress' || milestone.status === 'rejected') &&
                         selectedMilestone === milestone._id && (
                          <CardContent className="pt-0 space-y-3 border-t">
                            <Textarea
                              placeholder="Describe your completed work and any deliverables..."
                              value={submissionDescription}
                              onChange={(e) => setSubmissionDescription(e.target.value)}
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleSubmitMilestone(milestone._id)}
                                disabled={submitting || !submissionDescription.trim()}
                                className="flex-1"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Submit Milestone
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedMilestone(null);
                                  setSubmissionDescription('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        )}

                        {isFreelancer && 
                         contract.status === 'active' &&
                         (milestone.status === 'pending' || milestone.status === 'in_progress' || milestone.status === 'rejected') &&
                         selectedMilestone !== milestone._id && (
                          <CardContent className="pt-0">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedMilestone(milestone._id)}
                              className="w-full"
                            >
                              Submit Work
                            </Button>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Parties */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Parties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Client</h3>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {contract.businessOwner.firstName} {contract.businessOwner.lastName}
                      </p>
                      {contract.businessOwner.companyName && (
                        <p className="text-sm text-gray-600">{contract.businessOwner.companyName}</p>
                      )}
                      <p className="text-sm text-gray-500 truncate">{contract.businessOwner.email}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Freelancer</h3>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {contract.freelancer.firstName} {contract.freelancer.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{contract.freelancer.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Contract Value</span>
                  <span className="font-semibold">
                    {contract.currency} {contract.type === 'fixed' ? contract.budget : `${contract.hourlyRate}/hr`}
                  </span>
                </div>
                {contract.type === 'hourly' && contract.weeklyLimit && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly Limit</span>
                    <span className="font-semibold">{contract.weeklyLimit} hours</span>
                  </div>
                )}
                {contract.milestones.length > 0 && (
                  <>
                    <div className="flex justify-between text-sm pt-3 border-t">
                      <span className="text-gray-600">Approved</span>
                      <span className="text-green-600 font-semibold">
                        {contract.currency} {contract.milestones
                          .filter(m => m.status === 'approved')
                          .reduce((sum, m) => sum + m.budget, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pending</span>
                      <span className="text-gray-900 font-semibold">
                        {contract.currency} {contract.milestones
                          .filter(m => m.status !== 'approved')
                          .reduce((sum, m) => sum + m.budget, 0)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => window.print()}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Contract
                </Button>
                {isBusinessOwner && contract.status === 'active' && (
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Raise Dispute
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
