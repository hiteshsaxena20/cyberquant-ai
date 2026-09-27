import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No Data Found',
  description = 'There are no records matching your current filter criteria.',
  icon: Icon = ShieldAlert,
  actionLabel = 'Reset Filters',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="glass-card p-12 text-center flex flex-col items-center justify-center my-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-400 shadow-inner">
        <Icon className="w-8 h-8 text-cyber-400" />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-dark-400">{description}</p>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-secondary text-sm flex items-center gap-2 mt-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
