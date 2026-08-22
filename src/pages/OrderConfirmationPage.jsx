import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { io } from 'socket.io-client';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ChefHat,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  CreditCard,
  Check
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/currency';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        const found = await orderService.getOrderById(orderId);
        setOrder(found);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  // Real-Time Socket.IO Listener for Order Status Updates
  useEffect(() => {
    if (!order) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      const roomKey = order._id || order.orderNumber || order.id;
      socket.emit('join:order', roomKey);
      if (order.userId) {
        socket.emit('join:user', order.userId);
      }
    });

    socket.on('order:status_changed', (data) => {
      if (data && (data.orderId === order._id || data.orderNumber === order.orderNumber)) {
        setOrder((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            status: data.status,
            statusTimeline: data.statusTimeline || prev.statusTimeline,
            updatedAt: data.updatedAt || new Date().toISOString()
          };
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [order?._id, order?.orderNumber]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-display font-bold text-2xl text-stone-900 mb-2">Order Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">We couldn't find details for order ID: {orderId}</p>
        <Link to="/menu" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm">
          Browse Menu
        </Link>
      </div>
    );
  }

  const steps = order.statusTimeline && order.statusTimeline.length > 0
    ? order.statusTimeline.map(s => ({
        title: s.status,
        desc: s.time || 'Pending',
        done: s.completed
      }))
    : [
        { title: 'Order Placed', desc: 'Received in system', done: true },
        { title: 'Kitchen Confirmed', desc: 'Order verified by manager', done: order.status !== 'Placed' },
        { title: 'Preparing Food', desc: 'Freshly cooked', done: ['Preparing', 'OutForDelivery', 'ReadyForPickup', 'Delivered', 'Completed'].includes(order.status) },
        { title: order.orderType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery', desc: 'With thermal rider', done: ['OutForDelivery', 'ReadyForPickup', 'Delivered', 'Completed'].includes(order.status) },
        { title: order.orderType === 'pickup' ? 'Completed' : 'Delivered', desc: 'At your doorstep', done: ['Delivered', 'Completed'].includes(order.status) }
      ];

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Header Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] text-center space-y-4 relative overflow-hidden"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-mono">
              ORDER ID: {order.orderNumber || order.id}
            </span>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-stone-900 mt-2">
              Thank You! Your Order is Confirmed
            </h1>
            <p className="text-stone-600 text-xs sm:text-base max-w-lg mx-auto mt-1">
              We've dispatched your order to our <strong>{order.restaurant?.name || 'UrbanBite Branch'}</strong> kitchen. Our chefs are already preparing your meal fresh!
            </p>
          </div>

          {/* Estimated Time & Pickup Code Badge */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-stone-900 text-white font-display text-sm font-bold shadow-md">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Estimated Time: <strong>{order.estimatedDeliveryTime || '30-40 mins'}</strong></span>
            </div>
            {order.pickupCode && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 text-white font-display text-sm font-bold shadow-md">
                <span>Pickup Code: <strong>{order.pickupCode}</strong></span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Live Step Tracker */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-stone-900 text-base">
              Live Order Status ({order.status})
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Tracking Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-2 relative">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors ${
                    step.done
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                >
                  {step.done ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <div>
                  <h4 className="font-display font-bold text-stone-900 text-xs sm:text-sm">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-stone-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Items List */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] space-y-4">
            <h3 className="font-display font-bold text-stone-900 text-base flex items-center gap-2 pb-2 border-b border-stone-100">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Dishes Ordered ({order.items?.length})</span>
            </h3>

            <div className="space-y-3 divide-y divide-stone-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-lg">🍔</div>
                    )}
                    <div>
                      <h4 className="font-bold text-stone-900">{item.quantity}x {item.name}</h4>
                      {item.instructions && (
                        <p className="text-[11px] text-amber-700 font-medium">Chef note: {item.instructions}</p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                </div>
              ))}
            </div>

            {/* Bill Math */}
            <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-stone-900">{formatPrice(order.summary?.subtotal || order.pricing?.subtotal)}</span>
              </div>
              {(order.summary?.discount > 0 || order.pricing?.discount > 0) && (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Discount:</span>
                  <span>-{formatPrice(order.summary?.discount || order.pricing?.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span>{formatPrice(order.summary?.tax || order.pricing?.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>{(order.summary?.deliveryFee === 0 || order.pricing?.deliveryFee === 0) ? 'FREE' : formatPrice(order.summary?.deliveryFee || order.pricing?.deliveryFee)}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-display font-black text-stone-900 text-base">
                <span>Grand Total:</span>
                <span>{formatPrice(order.summary?.grandTotal || order.pricing?.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Kitchen Contact Details */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-stone-900 text-base flex items-center gap-2 pb-2 border-b border-stone-100">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Delivery & Contact Info</span>
              </h3>

              <div className="space-y-2.5 text-xs text-stone-600">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Recipient:</span>
                  <strong className="text-stone-800 text-sm">{order.customer?.name}</strong>
                  <span className="text-stone-500 block">{order.customer?.phone} • {order.customer?.email}</span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Delivery Location:</span>
                  <p className="text-stone-800 font-medium">{order.customer?.address}</p>
                  {order.customer?.instructions && (
                    <p className="text-stone-500 text-[11px] mt-0.5">Rider note: "{order.customer.instructions}"</p>
                  )}
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Payment Method & Status:</span>
                  <span className="font-bold text-stone-800">{order.paymentMethod}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Branch Contact */}
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 text-xs space-y-1">
                <span className="font-bold text-stone-900 block">Kitchen Branch:</span>
                <p className="text-stone-600">{order.restaurant?.name || 'UrbanBite Branch'} ({order.restaurant?.phone || '+92 42 3574 8891'})</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Link
                to="/orders"
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-display font-bold text-xs sm:text-sm text-center block shadow-md transition-colors"
              >
                View in Order History
              </Link>
              <Link
                to="/menu"
                className="w-full py-2.5 px-4 rounded-xl text-stone-600 hover:bg-stone-100 text-center block text-xs font-semibold transition-colors"
              >
                Continue Browsing Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
