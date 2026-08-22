import React from 'react';
import { CreditCard, Banknote, Wallet } from 'lucide-react';
import { PAYMENT_METHODS } from '../../utils/constants';

export const PaymentMethod = ({ selectedMethod, onSelectMethod }) => {
  const getIcon = (id) => {
    if (id === 'cod') return Banknote;
    if (id === 'card') return CreditCard;
    return Wallet;
  };

  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        3. Payment Method
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((pm) => {
          const Icon = getIcon(pm.id);
          const isSelected = selectedMethod === pm.name;
          return (
            <div
              key={pm.id}
              onClick={() => onSelectMethod(pm.name)}
              className={`flex items-center gap-3.5 rounded-2xl p-4 border cursor-pointer transition-all ${
                isSelected
                  ? 'border-rose-600 bg-rose-50/50 shadow-md ring-1 ring-rose-600'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                  isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{pm.name}</h4>
                <p className="text-[11px] text-slate-500">{pm.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethod;
