import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const PasswordInput = ({ label = 'Password', error, value, onChange, placeholder = '••••••••', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">{label}</label>}
      <div className="relative rounded-xl shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Lock size={18} />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${
            error ? 'border-rose-500 ring-1 ring-rose-500' : ''
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};

export default PasswordInput;
