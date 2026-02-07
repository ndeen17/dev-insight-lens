import { Calendar, DollarSign, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Contract } from '@/types/contract';

interface ContractCardProps {
  contract: Contract;
  userRole?: 'BusinessOwner' | 'Freelancer';
}

export default function ContractCard({ contract, userRole }: ContractCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'active':
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'disputed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'rejected' && userRole === 'Freelancer') return 'Declined';
    if (status === 'pending' && userRole === 'Freelancer') return 'Pending Offer';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: contract.currency || 'USD',
    }).format(value);
  };

  const completedMilestones = contract.milestones?.filter(
    m => m.status === 'approved' || m.status === 'paid'
  ).length || 0;
  const totalMilestones = contract.milestones?.length || 0;

  const otherParty =
    userRole === 'BusinessOwner'
      ? (contract.contributor
          ? `${contract.contributor.firstName} ${contract.contributor.lastName}`
          : contract.contributorEmail)
      : (contract.creator
          ? `${contract.creator.firstName} ${contract.creator.lastName}`
          : '');

  const amount = contract.budget
    ? formatCurrency(contract.budget)
    : contract.hourlyRate
    ? `${formatCurrency(contract.hourlyRate)}/hr`
    : null;

  const handleClick = () => {
    // Pending offers for freelancers → respond page
    if (contract.status === 'pending' && userRole === 'Freelancer') {
      navigate(`/contracts/${contract._id}/respond`);
      return;
    }
    // All other statuses → shared contract detail page
    navigate(`/employer/contracts/${contract._id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {contract.contractName}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(contract.status)}`}>
              {getStatusLabel(contract.status)}
            </span>
            {contract.contractType && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-50 text-gray-500 border border-gray-100">
                {contract.contractType === 'fixed' ? 'Fixed' : 'Hourly'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {contract.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {contract.description}
        </p>
      )}

      {/* Rejection reason */}
      {contract.status === 'rejected' && contract.rejectionReason && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
          <span className="font-medium">Decline reason:</span> {contract.rejectionReason}
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 mb-4">
        {/* Budget / Rate */}
        {amount && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-semibold text-gray-900">{amount}</span>
          </div>
        )}

        {/* Other Party */}
        {otherParty && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span>{otherParty}</span>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>Created {formatDate(contract.createdAt)}</span>
        </div>
      </div>

      {/* Milestones Progress */}
      {totalMilestones > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Milestones</span>
            <span className="font-semibold text-gray-900">
              {completedMilestones} / {totalMilestones}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-lime-400 h-2 rounded-full transition-all"
              style={{ width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Respond CTA for pending offers */}
      {contract.status === 'pending' && userRole === 'Freelancer' && (
        <div className="pt-4 border-t border-gray-100 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-yellow-700 font-medium">Action needed</span>
            <span className="flex items-center text-sm font-semibold text-lime-600">
              Respond <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
