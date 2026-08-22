import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { formatCurrency } from '../../utils/currency';
import OrderStatus from './OrderStatus';

export const OrderCard = ({ order }) => {
  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <span className="font-mono text-xs font-bold text-slate-900">#{order.id}</span>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Clock size={12} /> {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatus status={order.status} />
      </div>

      <div className="space-y-1.5 text-xs text-slate-600">
        {order.items?.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span>{item.quantity}x {item.name}</span>
            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
        {order.items?.length > 3 && (
          <p className="text-[11px] text-slate-400 italic">+ {order.items.length - 3} more items</p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div>
          <span className="text-[11px] text-slate-400">Total Paid</span>
          <p className="text-base font-black text-rose-600">{formatCurrency(order.grandTotal)}</p>
        </div>
        <Link
          to={`/orders/${order.id}`}
          className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          View Details <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
