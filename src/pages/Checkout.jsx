import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import CustomerInformation from '../components/checkout/CustomerInformation';
import DeliveryInformation from '../components/checkout/DeliveryInformation';
import PaymentMethod from '../components/checkout/PaymentMethod';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import OrderConfirmation from '../components/checkout/OrderConfirmation';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import orderService from '../services/orderService';
import { validateCheckoutForm } from '../utils/validation';

export const Checkout = () => {
  const { currentUser } = useAuth();
  const { cartItems, clearCart, subtotal, discount, tax, deliveryFee, total } = useCart();

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    city: currentUser?.city || 'Lahore',
    area: 'DHA Phase 5',
    address: currentUser?.address || '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    const { isValid, errors: validationErrors } = validateCheckoutForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const orderPayload = {
        items: cartItems,
        subtotal,
        discount,
        tax,
        deliveryFee,
        grandTotal: total,
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        area: formData.area,
        address: formData.address,
        notes: formData.notes,
        paymentMethod,
      };

      const newOrder = await orderService.createOrder(orderPayload);
      clearCart();
      setConfirmedOrder(newOrder);
    } catch (err) {
      console.error('Order placement failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <PageContainer>
          <OrderConfirmation order={confirmedOrder} />
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <PageContainer>
        <h1 className="text-2xl font-black text-slate-900 border-b border-slate-200 pb-4 mb-8">
          Checkout & Order Details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CustomerInformation formData={formData} handleChange={handleChange} errors={errors} />
            <DeliveryInformation formData={formData} handleChange={handleChange} errors={errors} />
            <PaymentMethod selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} />
          </div>

          <div>
            <CheckoutSummary isSubmitting={isSubmitting} onPlaceOrder={handlePlaceOrder} />
          </div>
        </div>
      </PageContainer>
    </main>
  );
};

export default Checkout;
