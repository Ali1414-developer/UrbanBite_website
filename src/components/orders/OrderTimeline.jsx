import React from 'react';
import { CheckCircle2, Clock, Bike, Home } from 'lucide-react';

export const OrderTimeline = ({ status }) => {
  const steps = [
    { label: 'Order Confirmed', icon: CheckCircle2, key: 'Confirmed' },
    { label: 'Kitchen Preparing', icon: Clock, key: 'Preparing' },
    { label: 'Out for Delivery', icon: Bike, key: 'Out for Delivery' },
    { label: 'Delivered', icon: Home, key: 'Delivered' },
  ];

  const getStepStatus = (stepKey) => {
    const statusOrder = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex <= currentIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-6">
      <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Live Order Tracking</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = getStepStatus(s.key) === 'completed';

          return (
            <div key={idx} className="flex flex-col items-center text-center space-y-2">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                  isDone ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon size={22} />
              </div>
              <span className={`text-xs font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
