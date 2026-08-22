import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import OrderStatus from '../components/orders/OrderStatus';
import OrderTimeline from '../components/orders/OrderTimeline';
import OrderItem from '../components/orders/OrderItem';
import orderService from '../services/orderService';
import { formatDate } from '../utils/formatters';
import { formatCurrency } from '../utils/currency';
import { ArrowLeft } from 'lucide-react';

export const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService.getOrderById(orderId).then((res) => {
      setOrder(res);
      setIsLoading(false);
    });
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-50 py-20 text-center">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link to="/orders" className="text-rose-600 font-bold mt-2 inline-block">
          Back to Orders
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <PageContainer className="space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600">
            <ArrowLeft size={16} /> Back to All Orders
          </Link>
          <OrderStatus status={order.status} />
        </div>

        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400">Order Reference</span>
            <h1 className="text-xl font-black text-slate-900">#{order.id}</h1>
          </div>
          <div>
            <span className="text-xs text-slate-400">Date Placed</span>
            <p className="text-sm font-bold text-slate-800">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Payment</span>
            <p className="text-sm font-bold text-slate-800">{order.paymentMethod || 'Cash on Delivery'}</p>
          </div>
        </div>

        <OrderTimeline status={order.status} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Items Ordered</h3>
            <div className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <OrderItem key={idx} item={item} />
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4 h-fit">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Delivery Details</h3>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-900">{order.customerName}</p>
              <p className="text-slate-600">{order.phone}</p>
              <p className="text-slate-600">{order.address}, {order.city}</p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST Tax</span>
                <span className="font-semibold text-slate-900">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-slate-900">
                  {order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Paid</span>
                <span className="text-rose-600">{formatCurrency(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
};

export default OrderDetails;
