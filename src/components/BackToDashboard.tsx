import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackToDashboardProps {
  userRole?: 'BusinessOwner' | 'Freelancer';
  label?: string;
}

export default function BackToDashboard({ userRole = 'BusinessOwner', label = 'Back to Dashboard' }: BackToDashboardProps) {
  const navigate = useNavigate();
  
  const dashboardPath = userRole === 'BusinessOwner' 
    ? '/employer/dashboard' 
    : '/freelancer/dashboard';

  return (
    <button
      onClick={() => navigate(dashboardPath)}
      className="inline-flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}
