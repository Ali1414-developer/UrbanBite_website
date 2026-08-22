import React from 'react';
import { MapPin, Building } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import { CITIES } from '../../utils/constants';

export const DeliveryInformation = ({ formData, handleChange, errors = {} }) => {
  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        2. Delivery Address
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Delivery City"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          options={CITIES.map((c) => ({ value: c.name, label: c.name }))}
          error={errors.city}
        />
        <Input
          label="Area / Neighborhood"
          icon={Building}
          placeholder="e.g. DHA Phase 5, Gulberg III"
          value={formData.area}
          onChange={(e) => handleChange('area', e.target.value)}
        />
      </div>

      <Input
        label="Complete Street Address"
        icon={MapPin}
        placeholder="House/Apartment #, Street, Block"
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
        error={errors.address}
        required
      />

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Rider Delivery Instructions (Optional)
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Ring bell twice, leave at reception..."
          rows={2}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500"
        />
      </div>
    </div>
  );
};

export default DeliveryInformation;
