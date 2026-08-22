import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = UtensilsCrossed,
  title = 'No items found',
  description = 'We could not find anything matching your current filters.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
      <div className="mb-4 rounded-full bg-rose-50 p-4 text-rose-600">
        <Icon size={36} />
      </div>
      <h4 className="text-lg font-bold text-slate-900">{title}</h4>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
