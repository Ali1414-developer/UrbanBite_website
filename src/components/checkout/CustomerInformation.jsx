import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import Input from '../common/Input';

export const CustomerInformation = ({ formData, handleChange, errors = {} }) => {
  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        1. Customer Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          icon={User}
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          error={errors.fullName}
          required
        />
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
        />
      </div>
      <Input
        label="Phone Number (For Delivery Confirmation)"
        icon={Phone}
        placeholder="03001234567"
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={errors.phone}
        required
      />
    </div>
  );
};

export default CustomerInformation;
