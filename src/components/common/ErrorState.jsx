import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'Failed to load content. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-rose-50/50 p-8 text-center border border-rose-100">
      <div className="mb-3 rounded-full bg-rose-100 p-3 text-rose-600">
        <AlertTriangle size={32} />
      </div>
      <h4 className="text-base font-bold text-slate-900">{title}</h4>
      <p className="mt-1 max-w-xs text-xs text-slate-600">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4 gap-2">
          <RefreshCw size={14} /> Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
