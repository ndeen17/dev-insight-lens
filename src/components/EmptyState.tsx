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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-up">
      {/* Icon with float animation */}
      <div className="w-20 h-20 mb-5 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 animate-float">
        {icon}
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      
      {/* Optional Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 text-sm text-black font-semibold bg-green-400 hover:bg-green-500 active:scale-[0.97] rounded-lg transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
