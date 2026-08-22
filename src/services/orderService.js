import api from './api';
import { generateOrderId } from '../utils/currency';

const ORDERS_KEY = 'urbanbite_orders';

const getStoredOrders = () => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const normalizeOrder = (order) => {
  if (!order) return null;
  const id = order.orderNumber || order.id || order._id;
  return {
    ...order,
    id,
    orderNumber: id,
    summary: order.pricing || order.summary || {
      subtotal: order.pricing?.subtotal || 0,
      discount: order.pricing?.discount || 0,
      tax: order.pricing?.tax || 0,
      deliveryFee: order.pricing?.deliveryFee || 0,
      grandTotal: order.pricing?.grandTotal || 0,
      promoCode: order.pricing?.promoCode || ''
    }
  };
};

export const orderService = {
  // Create a new order
  createOrder: async ({ userId, restaurant, items, summary, customer, paymentMethod, orderType }) => {
    const type = orderType || customer?.orderType || 'delivery';
    const promoCode = summary?.promoCode || '';

    const formattedItems = (items || []).map((item) => ({
      foodId: item.foodId || item.id || item._id || 'item-1',
      name: item.name,
      image: item.image || '',
      price: item.price,
      quantity: item.quantity,
      instructions: item.instructions || ''
    }));

    const payload = {
      items: formattedItems,
      orderType: type,
      restaurant: restaurant || {},
      customer: customer || {},
      paymentMethod,
      promoCode
    };

    try {
      const { data } = await api.post('/orders', payload);
      if (data.success && data.data) {
        const norm = normalizeOrder(data.data);
        // Save to local cache as backup
        const stored = getStoredOrders();
        stored.unshift(norm);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(stored));
        return norm;
      }
    } catch (e) {
      console.warn('Backend API order error, creating local fallback order:', e.message);
    }

    // Local fallback order
    const orderId = generateOrderId();
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const localOrder = normalizeOrder({
      id: orderId,
      orderNumber: orderId,
      userId: userId || 'guest',
      restaurant: restaurant || {},
      items: formattedItems,
      summary,
      customer,
      paymentMethod,
      orderType: type,
      status: 'Confirmed',
      statusTimeline: [
        { status: 'Order Placed', time: `${formattedDate}, ${formattedTime}`, completed: true },
        { status: 'Confirmed', time: `${formattedDate}, ${formattedTime}`, completed: true },
        { status: 'Preparing', time: 'In progress', completed: false },
        { status: type === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery', time: 'Pending', completed: false },
        { status: type === 'pickup' ? 'Completed' : 'Delivered', time: 'Pending', completed: false }
      ],
      estimatedDeliveryTime: type === 'pickup' ? '15-20 min' : '30-40 min',
      createdAt: now.toISOString()
    });

    const stored = getStoredOrders();
    stored.unshift(localOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(stored));

    return localOrder;
  },

  // Get orders by customer ID or email
  getUserOrders: async (userId, userEmail) => {
    try {
      const { data } = await api.get('/orders/my-orders');
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(normalizeOrder);
      }
    } catch (e) {
      console.warn('Backend API my-orders error, using local fallback:', e.message);
    }

    const orders = getStoredOrders();
    if (!userId && !userEmail) return orders.map(normalizeOrder);
    return orders
      .filter(
        (o) =>
          (userId && (o.userId === userId || o.userId?._id === userId)) ||
          (userEmail && o.customer?.email?.toLowerCase() === userEmail?.toLowerCase())
      )
      .map(normalizeOrder);
  },

  // Alias for getOrders
  getOrders: async () => {
    return orderService.getUserOrders();
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      if (data.success && data.data) {
        return normalizeOrder(data.data);
      }
    } catch (e) {
      console.warn('Backend API order detail error, checking local storage:', e.message);
    }

    const orders = getStoredOrders();
    const found = orders.find((o) => o.id === orderId || o.orderNumber === orderId || o._id === orderId);
    return normalizeOrder(found || null);
  }
};

export default orderService;
