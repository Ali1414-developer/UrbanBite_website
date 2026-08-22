import React from 'react';
import { CheckCircle } from 'lucide-react';

export const BranchInformation = ({ restaurant }) => {
  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-900">Available Branch Facilities</h3>
      <div className="grid grid-cols-2 gap-3">
        {restaurant.facilities?.map((facility, index) => (
          <div key={index} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
            <span>{facility}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchInformation;
