import { Calendar, DollarSign, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContractCardProps {
  contract: {
    _id: string;
    contractName: string;
    description?: string;
    budget?: number;
    status: string;
    freelancerEmail?: string;
    businessOwnerEmail?: string;
    createdAt: string;
    milestones?: Array<{
      title: string;
      amount: number;
      status: string;
    }>;
  };
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
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const completedMilestones = contract.milestones?.filter(m => m.status === 'completed').length || 0;
  const totalMilestones = contract.milestones?.length || 0;

  return (
    <div 
      onClick={() => navigate(`/contract/${contract._id}`)}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {contract.contractName}
          </h3>
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(contract.status)}`}>
            {contract.status}
          </span>
        </div>
      </div>

      {/* Description */}
      {contract.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {contract.description}
        </p>
      )}

      {/* Details */}
      <div className="space-y-2 mb-4">
        {/* Budget */}
        {contract.budget && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-semibold text-gray-900">${contract.budget.toLocaleString()}</span>
          </div>
        )}

        {/* Other Party */}
        {userRole === 'BusinessOwner' && contract.freelancerEmail && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span>{contract.freelancerEmail}</span>
          </div>
        )}
        {userRole === 'Freelancer' && contract.businessOwnerEmail && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span>{contract.businessOwnerEmail}</span>
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
              className="bg-green-400 h-2 rounded-full transition-all"
              style={{ width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
