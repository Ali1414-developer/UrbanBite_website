import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Phone,
  User,
  Mail,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  ChefHat,
  ShoppingBag,
  Building2,
  Check,
  Truck,
  Store,
  FileText,
  Lock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/currency';
import { validatePhone, validateEmail } from '../utils/validation';
import { isBranchOpen, getBranchStatusInfo } from '../utils/branchStatus';
import toast from 'react-hot-toast';

export const CheckoutPage = () => {
  const { cartItems, totals, promoCode, clearCart } = useCart();
  const { currentUser, isAuthenticated, promptLogin } = useAuth();
  const { selectedCity, selectedBranch, setIsLocationModalOpen } = useLocation();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('delivery'); // 'delivery' or 'pickup'
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey] = useState(() => `idempotent_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    if (type === 'pickup' && paymentMethod === 'Cash') {
      setPaymentMethod('Credit / Debit Card');
    }
  };

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Lahore',
    area: 'DHA Phase 6',
    address: '',
    instructions: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    walletNumber: ''
  });

  const [errors, setErrors] = useState({});

  // Sync user info into form on mount
  useEffect(() => {
    if (!isAuthenticated) {
      promptLogin('/checkout');
    } else if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        city: currentUser.city || selectedCity || 'Lahore',
        address: currentUser.address || ''
      }));
    }
  }, [isAuthenticated, currentUser, selectedCity]);

  // If cart is empty, redirect to menu
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-stone-900 mb-2">No items to checkout</h2>
        <p className="text-xs text-stone-500 mb-6">Please add some tasty food to your cart first.</p>
        <Link to="/menu" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors">
          Browse Menu
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validatePhone(formData.phone)) newErrors.phone = 'Valid 11-digit Pakistani phone number is required (e.g. 03001234567)';

    if (orderType === 'delivery') {
      if (!formData.address.trim() || formData.address.trim().length < 5) {
        newErrors.address = 'Detailed street address is required for delivery';
      }
    }

    if (paymentMethod === 'Credit / Debit Card') {
      if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Enter valid 16-digit card number';
      }
    }

    if (paymentMethod === 'JazzCash / Easypaisa') {
      if (!validatePhone(formData.walletNumber || formData.phone)) {
        newErrors.walletNumber = 'Enter a valid mobile wallet number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      promptLogin('/checkout');
      return;
    }
    if (!validate()) {
      toast.error('Please complete all required fields correctly');
      return;
    }

    if (selectedBranch && !isBranchOpen(selectedBranch)) {
      const { openTime } = getBranchStatusInfo(selectedBranch);
      toast.error(
        `"${selectedBranch.name}" is currently closed (Orders open at ${openTime}). Please choose an open branch to place your order!`,
        { duration: 5000, icon: '🔒' }
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        idempotencyKey,
        userId: currentUser?.id || 'usr-1',
        restaurant: selectedBranch || {
          id: 'urbanbite-dha-lahore',
          name: 'UrbanBite DHA Phase 6',
          city: formData.city,
          address: 'Sector CCA, Block MB, DHA Phase 6',
          phone: '+92 42 3574 8891'
        },
        items: cartItems.map((item) => ({
          foodId: item.foodId,
          id: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          instructions: item.instructions || ''
        })),
        summary: totals,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          area: formData.area,
          address: orderType === 'delivery' ? formData.address : `Self-Pickup at ${selectedBranch?.name}`,
          instructions: formData.instructions,
          orderType
        },
        paymentMethod
      };

      const placedOrder = await orderService.createOrder(orderPayload);

      // Trigger Confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${placedOrder.orderNumber || placedOrder.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-stone-900">
            Checkout &amp; Order Confirmation
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Complete your delivery details and choose your preferred payment option
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Branch Closed Warning Banner */}
            {selectedBranch && !isBranchOpen(selectedBranch) && (
              <div className="p-4 rounded-3xl bg-red-50/90 border border-red-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-sm text-red-900">
                      Selected Branch ({selectedBranch.name}) is Currently Closed
                    </h4>
                    <p className="text-xs text-red-600 mt-0.5">
                      {getBranchStatusInfo(selectedBranch).closedNotice}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shrink-0 shadow-sm transition-colors cursor-pointer"
                >
                  Change Branch
                </button>
              </div>
            )}

            {/* Step 1: Order Type Selector */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  <h3 className="font-display font-bold text-stone-900 text-base">Select Order Type</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Building2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Branch: {selectedBranch?.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOrderTypeChange('delivery')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    orderType === 'delivery'
                      ? 'bg-red-50/70 border-red-500 ring-2 ring-red-500/20'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${orderType === 'delivery' ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-700'}`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="font-display font-bold text-stone-900 text-sm">Express Delivery</span>
                    </div>
                    {orderType === 'delivery' && (
                      <span className="inline-flex items-center gap-1 text-red-600 font-bold text-xs bg-red-100/60 px-2 py-0.5 rounded-md">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 pl-10">Delivered hot to your doorstep in 30-40 min</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleOrderTypeChange('pickup')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    orderType === 'pickup'
                      ? 'bg-red-50/70 border-red-500 ring-2 ring-red-500/20'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${orderType === 'pickup' ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-700'}`}>
                        <Store className="w-4 h-4" />
                      </div>
                      <span className="font-display font-bold text-stone-900 text-sm">Takeaway / Pickup</span>
                    </div>
                    {orderType === 'pickup' && (
                      <span className="inline-flex items-center gap-1 text-red-600 font-bold text-xs bg-red-100/60 px-2 py-0.5 rounded-md">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 pl-10">Ready for pickup at restaurant in 15-20 min</p>
                </button>
              </div>
            </div>

            {/* Step 2: Contact & Address Info */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                <h3 className="font-display font-bold text-stone-900 text-base">Customer &amp; Delivery Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ali Raza"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-stone-800 ${
                      errors.name ? 'border-red-500 bg-red-50/40' : 'border-stone-200 bg-stone-50/60 focus:border-red-500'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>Mobile Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 03001234567"
                    maxLength={11}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-stone-800 ${
                      errors.phone ? 'border-red-500 bg-red-50/40' : 'border-stone-200 bg-stone-50/60 focus:border-red-500'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>Email Address (for Receipt &amp; Tracking) *</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. aliraza777212@gmail.com"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-stone-800 ${
                      errors.email ? 'border-red-500 bg-red-50/40' : 'border-stone-200 bg-stone-50/60 focus:border-red-500'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                </div>

                {orderType === 'delivery' && (
                  <>
                    {/* City */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-1.5">
                        <Building2 className="w-3.5 h-3.5 text-stone-400" />
                        <span>City *</span>
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 text-xs sm:text-sm font-semibold text-stone-800 focus:border-red-500"
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Multan">Multan</option>
                      </select>
                    </div>

                    {/* Area */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>Neighborhood / Sector *</span>
                      </label>
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="e.g. DHA Phase 6, Gulberg, Blue Area"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 text-xs sm:text-sm text-stone-800 focus:border-red-500"
                      />
                    </div>

                    {/* Full Address */}
                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>Complete Street / House Address *</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        placeholder="e.g. House 42, Street 7, Sector Y, Block CCA..."
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-stone-800 resize-none ${
                          errors.address ? 'border-red-500 bg-red-50/40' : 'border-stone-200 bg-stone-50/60 focus:border-red-500'
                        }`}
                      />
                      {errors.address && <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>}
                    </div>

                    {/* Delivery Instructions */}
                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-1.5">
                        <FileText className="w-3.5 h-3.5 text-stone-400" />
                        <span>Rider / Delivery Instructions (Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        placeholder="e.g. Ring doorbell twice, leave at reception, call when outside..."
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 text-xs sm:text-sm text-stone-800 focus:border-red-500"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                <h3 className="font-display font-bold text-stone-900 text-base">Payment Method</h3>
              </div>

              <div className="space-y-3">
                {/* Cash (Only for Express Delivery) */}
                {orderType === 'delivery' && (
                  <div
                    onClick={() => setPaymentMethod('Cash')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'Cash'
                        ? 'bg-red-50/70 border-red-500 ring-2 ring-red-500/20'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-stone-900 text-sm">Cash</h4>
                        <p className="text-xs text-stone-500">Pay cash directly upon delivery</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Cash' ? 'border-red-600 bg-red-600' : 'border-stone-300'}`}>
                      {paymentMethod === 'Cash' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                )}

                {/* Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('Credit / Debit Card')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'Credit / Debit Card'
                      ? 'bg-red-50/70 border-red-500 ring-2 ring-red-500/20'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-stone-900 text-sm">Credit / Debit Card</h4>
                        <p className="text-xs text-stone-500">Visa, Mastercard, PayPak secured payment</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Credit / Debit Card' ? 'border-red-600 bg-red-600' : 'border-stone-300'}`}>
                      {paymentMethod === 'Credit / Debit Card' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  {paymentMethod === 'Credit / Debit Card' && (
                    <div className="mt-4 pt-3 border-t border-stone-200 space-y-3">
                      <div>
                        <label className="flex items-center gap-1 text-[11px] font-bold text-stone-600 mb-1">
                          <CreditCard className="w-3 h-3 text-stone-400" />
                          <span>Card Number</span>
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="4242 •••• •••• 4242"
                          maxLength={19}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white focus:border-red-500 focus:outline-none"
                        />
                        {errors.cardNumber && <p className="text-[11px] text-red-600 mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="flex items-center gap-1 text-[11px] font-bold text-stone-600 mb-1">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            <span>Expiry (MM/YY)</span>
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            placeholder="12/28"
                            maxLength={5}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white focus:border-red-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-1 text-[11px] font-bold text-stone-600 mb-1">
                            <Lock className="w-3 h-3 text-stone-400" />
                            <span>CVC / CVV</span>
                          </label>
                          <input
                            type="password"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleChange}
                            placeholder="•••"
                            maxLength={4}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white focus:border-red-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* JazzCash / Easypaisa */}
                <div
                  onClick={() => setPaymentMethod('JazzCash / Easypaisa')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'JazzCash / Easypaisa'
                      ? 'bg-red-50/70 border-red-500 ring-2 ring-red-500/20'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-stone-900 text-sm">JazzCash / Easypaisa Mobile Wallet</h4>
                        <p className="text-xs text-stone-500">Pay via OTP prompt on your mobile wallet app</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'JazzCash / Easypaisa' ? 'border-red-600 bg-red-600' : 'border-stone-300'}`}>
                      {paymentMethod === 'JazzCash / Easypaisa' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  {paymentMethod === 'JazzCash / Easypaisa' && (
                    <div className="mt-4 pt-3 border-t border-stone-200">
                      <label className="flex items-center gap-1 text-[11px] font-bold text-stone-600 mb-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>Wallet Account Mobile Number</span>
                      </label>
                      <input
                        type="tel"
                        name="walletNumber"
                        value={formData.walletNumber || formData.phone}
                        onChange={handleChange}
                        placeholder="03001234567"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card & Place Order CTA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-display font-bold text-stone-900 text-base flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-red-600" />
                  <span>Order Items ({totals.itemCount})</span>
                </h3>
                <Link to="/cart" className="text-xs text-red-600 font-bold hover:underline">
                  Edit
                </Link>
              </div>

              {/* Items preview */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-stone-100">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="font-bold text-red-600">{item.quantity}x</span>
                      <div className="truncate">
                        <span className="font-semibold text-stone-900">{item.name}</span>
                        {item.instructions && (
                          <span className="block text-[10px] text-stone-400 truncate">Note: {item.instructions}</span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-stone-900 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPrice(totals.subtotal)}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Discount ({promoCode})</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST / Tax (5%)</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {orderType === 'pickup' ? (
                      <strong className="text-emerald-600 font-bold">PICKUP ($0)</strong>
                    ) : totals.deliveryFee === 0 ? (
                      <strong className="text-emerald-600 font-bold">FREE</strong>
                    ) : (
                      formatPrice(totals.deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-lg">
                  <span className="font-display font-black text-stone-900">Total Payable</span>
                  <span className="font-display font-black text-xl text-stone-900">
                    {formatPrice(totals.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Place Order</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Secure Checkout
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-red-600" />
                  30-40 min Delivery
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
