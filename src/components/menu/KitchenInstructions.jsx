import React from 'react';
import { ChefHat } from 'lucide-react';

export const KitchenInstructions = ({ instructions, setInstructions }) => {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
        <ChefHat size={14} className="text-rose-600" /> Kitchen Instructions (Optional)
      </label>
      <textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="e.g. Extra spicy, no onions, sauce on the side..."
        rows={2}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
      />
    </div>
  );
};

export default KitchenInstructions;
