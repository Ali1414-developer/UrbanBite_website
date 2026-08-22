import React from 'react';
import { Flame } from 'lucide-react';

export const AuthImagePanel = ({ title, subtitle, imageUrl }) => {
  return (
    <div className="relative hidden lg:flex flex-1 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white">
      <div className="absolute inset-0 opacity-40">
        <img src={imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80'} alt="Auth Background" className="h-full w-full object-cover" />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <img src="/logo.png" alt="UrbanBite Logo" className="w-11 h-11 object-contain" />
        <span className="text-2xl font-black text-white">Urban<span className="text-red-500">Bite</span></span>
      </div>

      <div className="relative z-10 max-w-md space-y-3">
        <h2 className="text-3xl font-extrabold text-white">{title || 'Taste The Urban Craving'}</h2>
        <p className="text-xs text-slate-300 leading-relaxed">{subtitle || 'Sign in to access your orders, saved addresses, and exclusive member discounts.'}</p>
      </div>

      <div className="relative z-10 text-[11px] text-slate-400">
        © {new Date().getFullYear()} UrbanBite Inc. All Rights Reserved.
      </div>
    </div>
  );
};

export default AuthImagePanel;
