import React from 'react';
import { Clock } from 'lucide-react';

export const OpeningHours = ({ restaurant }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-base font-bold text-slate-900">
        <Clock size={18} className="text-rose-600" />
        <h3>Weekly Opening Hours</h3>
      </div>
      <div className="space-y-2 divide-y divide-slate-100">
        {days.map((day, idx) => (
          <div key={idx} className="flex justify-between text-xs pt-2 first:pt-0">
            <span className="font-semibold text-slate-700">{day}</span>
            <span className="text-slate-500">{restaurant.openingTime} - {restaurant.closingTime}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpeningHours;
