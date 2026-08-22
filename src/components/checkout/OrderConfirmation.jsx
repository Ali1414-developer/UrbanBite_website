import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/currency';

export const OrderConfirmation = ({ order }) => {
  const navigate = useNavigate();

  if (!order) return null;

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 md:p-12 text-center border border-slate-200 shadow-xl max-w-xl mx-auto space-y-6">
      <div className="rounded-full bg-emerald-100 p-4 text-emerald-600">
        <CheckCircle2 size={56} />
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-rose-600">Order Placed Successfully!</span>
        <h2 className="text-2xl font-black text-slate-900 mt-1">Thank You For Ordering</h2>
        <p className="text-xs text-slate-500 mt-2">
          Your order <span className="font-mono font-bold text-slate-900">#{order.id}</span> has been confirmed and sent to our kitchen.
        </p>
      </div>

      <div className="w-full rounded-2xl bg-slate-50 p-4 text-left text-xs space-y-2 border border-slate-200/80">
        <div className="flex justify-between border-b border-slate-200 pb-2">
          <span className="text-slate-500">Estimated Delivery:</span>
          <span className="font-bold text-slate-900">25 - 35 Mins</span>
        </div>
        <div className="flex justify-between border-b border-slate-200 pb-2">
          <span className="text-slate-500">Delivery Address:</span>
          <span className="font-bold text-slate-900 truncate max-w-xs">{order.address}, {order.city}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Total Amount:</span>
          <span className="font-extrabold text-rose-600">{formatCurrency(order.grandTotal)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button variant="outline" fullWidth onClick={() => navigate('/menu')}>
          Order More Food
        </Button>
        <Button variant="primary" fullWidth onClick={() => navigate(`/orders/${order.id}`)} className="gap-2">
          Track Order Status <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
