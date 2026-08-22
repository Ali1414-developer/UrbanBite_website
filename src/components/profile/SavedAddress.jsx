import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import Badge from '../common/Badge';

export const SavedAddress = () => {
  const addresses = [
    { id: 1, title: 'Home', address: 'Plot 45, Street 12, DHA Phase 5, Lahore', isDefault: true },
    { id: 2, title: 'Office', address: 'Level 4, Software Park, Gulberg III, Lahore', isDefault: false },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900">Saved Delivery Addresses</h3>
        <button className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline">
          <Plus size={14} /> Add New
        </button>
      </div>

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="flex items-start gap-3 rounded-2xl border border-slate-200/80 p-3.5 bg-slate-50/50">
            <MapPin size={18} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">{addr.title}</h4>
                {addr.isDefault && <Badge variant="emerald">Default</Badge>}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{addr.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedAddress;
