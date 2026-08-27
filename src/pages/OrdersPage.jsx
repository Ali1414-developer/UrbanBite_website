import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ClipboardList,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Building2,
  Truck,
  Store,
  CreditCard,

  Banknote,
  Smartphone,
  ChevronRight,
  Receipt,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/currency';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const OrdersPage = () => {
  const { currentUser, isAuthenticated, promptLogin } = useAuth();
  const { addToCart, openCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const list = await orderService.getUserOrders(currentUser?.id, currentUser?.email);
      setOrders(list || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser, isAuthenticated]);

  // Real-time socket listener for status updates from Reception / Admin
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    if (currentUser?.id || currentUser?._id) {
      socket.emit('join:user', currentUser.id || currentUser._id);
    }

    socket.on('order:status_changed', (data) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.orderId || o.orderNumber === data.orderNumber
            ? { ...o, status: data.status, statusTimeline: data.statusTimeline || o.statusTimeline }
            : o
        )
      );
    });

    socket.on('order:created', () => {
      fetchOrders();
    });

    return () => socket.disconnect();
  }, [currentUser?.id, currentUser?._id]);

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          categoryId: 'reorder'
        },
        item.quantity,
        item.instructions || ''
      );
    });
    toast.success('Items added to cart!');
    openCart();
  };

  const formatOrderDateTime = (dateString) => {
    if (!dateString) return 'Recent Order';
    const d = new Date(dateString);
    const dateFormatted = d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timeFormatted = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${dateFormatted} at ${timeFormatted}`;
  };

  if (!isAuthenticated && orders.length === 0 && !loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-stone-50">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 shadow-sm">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-stone-900 mb-2">Login to View Your Orders</h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mb-6 leading-relaxed">
          Please log in to track your active meals, view past order receipts, and reorder favorites in 1 click.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => promptLogin('/orders')}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Login to Account
          </button>
          <Link
            to="/menu"
            className="px-6 py-3 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-xl font-bold text-sm transition-all"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-stone-900">
              Order History &amp; Tracking
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Complete receipts with order type, timestamps, payment methods, and live status
            </p>
          </div>

          <Link
            to="/menu"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            Explore Menu &amp; Deals
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
            <ShoppingBag className="w-16 h-16 mx-auto text-stone-300 mb-3" />
            <h3 className="font-display font-bold text-xl text-stone-900 mb-1">No Orders Yet</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto mb-6">
              You haven't placed any orders with UrbanBite yet. Savor our flame-grilled burgers or pizzas today!
            </p>
            <Link
              to="/menu"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isDelivered = order.status === 'Delivered';
              const isPickup = (order.orderType === 'pickup' || order.customer?.orderType === 'pickup');

              // Determine payment icon
              const getPaymentIcon = () => {
                if (order.paymentMethod === 'Cash') {
                  return <Banknote className="w-4 h-4 text-emerald-600" />;
                }
                if (order.paymentMethod === 'Credit / Debit Card') {
                  return <CreditCard className="w-4 h-4 text-blue-600" />;
                }
                return <Smartphone className="w-4 h-4 text-orange-600" />;
              };

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.2)] hover:border-red-400/60 transition-all duration-300 space-y-5"
                >
                  {/* 1. Header Bar: ID, Status, Method & Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-stone-100 px-3 py-1 rounded-lg text-stone-900 border border-stone-200">
                          {order.id}
                        </span>

                        {/* Order Type Badge */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${isPickup
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                          }`}>
                          {isPickup ? <Store className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                          <span>{isPickup ? 'Takeaway / Pickup' : 'Express Delivery'}</span>
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800 animate-pulse'
                            }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-medium pt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Placed on: <strong className="text-stone-700">{formatOrderDateTime(order.createdAt)}</strong></span>
                      </div>
                    </div>

                    {/* Grand Total Highlight */}
                    <div className="sm:text-right bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-stone-100 flex items-center justify-between sm:block">
                      <span className="text-xs text-stone-400 block font-medium">Grand Total</span>
                      <span className="font-display font-black text-stone-900 text-xl sm:text-2xl text-red-600">
                        {formatPrice(order.summary?.grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* 2. Order Metadata Info Cards (Order Method, Payment Method, Location) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-xs">
                    {/* Order Method */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Order Method
                      </span>
                      <div className="flex items-center gap-2 font-bold text-stone-800">
                        {isPickup ? <Store className="w-4 h-4 text-amber-600" /> : <Truck className="w-4 h-4 text-red-600" />}
                        <span>{isPickup ? 'Self Pickup at Branch' : 'Doorstep Delivery'}</span>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Payment Method
                      </span>
                      <div className="flex items-center gap-2 font-bold text-stone-800">
                        {getPaymentIcon()}
                        <span>{order.paymentMethod || 'Cash'}</span>
                      </div>
                    </div>

                    {/* Restaurant Branch */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Fulfilling Branch
                      </span>
                      <div className="flex items-center gap-2 font-bold text-stone-800 truncate">
                        <Building2 className="w-4 h-4 text-red-600 shrink-0" />
                        <span className="truncate">{order.restaurant?.name || 'UrbanBite Main Branch'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Items Ordered Breakdown */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-700 block">Items Ordered ({order.items?.length || 0})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-13 h-13 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-stone-900 text-xs truncate">
                              {item.quantity}x {item.name}
                            </h4>
                            <span className="text-[11px] text-stone-500 font-semibold block">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            {item.instructions && (
                              <p className="text-[10px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1 inline-block truncate max-w-full font-medium">
                                Note: {item.instructions}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Price Breakdown Summary */}
                  {order.summary && (
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1.5 text-xs text-stone-600">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-semibold text-stone-900">{formatPrice(order.summary.subtotal)}</span>
                      </div>
                      {order.summary.discount > 0 && (
                        <div className="flex justify-between text-red-600 font-semibold">
                          <span>Promo Discount:</span>
                          <span>-{formatPrice(order.summary.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>GST / Sales Tax (5%):</span>
                        <span className="font-semibold text-stone-900">{formatPrice(order.summary.tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span className="font-semibold text-stone-900">
                          {order.summary.deliveryFee === 0 ? (
                            <span className="text-emerald-700 font-bold">FREE DELIVERY</span>
                          ) : (
                            formatPrice(order.summary.deliveryFee)
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 5. Address and Actions Footer */}
                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start sm:items-center gap-2 text-stone-600">
                      <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5 sm:mt-0" />
                      <span className="truncate max-w-md font-medium">
                        {isPickup ? `Pickup: ${order.restaurant?.address || 'Restaurant Counter'}` : (order.customer?.address || 'Doorstep Delivery')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>

                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="flex items-center gap-1 text-stone-800 hover:text-red-600 font-bold px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 transition-colors"
                      >
                        <span>Live Tracking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
