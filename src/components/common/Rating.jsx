import React from 'react';
import { Star } from 'lucide-react';

export const Rating = ({ rating = 5.0, count, showCount = true, size = 16, className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-amber-400">
        <Star size={size} fill="currentColor" />
      </div>
      <span className="text-xs font-bold text-slate-900">{Number(rating).toFixed(1)}</span>
      {showCount && count !== undefined && (
        <span className="text-xs text-slate-500">({count})</span>
      )}
    </div>
  );
};

export default Rating;
