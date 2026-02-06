import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
        {icon}
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
        {description}
      </p>
      
      {/* Optional Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 text-black font-bold bg-green-400 hover:bg-green-500 rounded-lg transition-colors shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
