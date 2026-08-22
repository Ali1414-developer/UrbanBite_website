import React, { useEffect, useState } from 'react';
import orderService from '../../services/orderService';
import OrderCard from '../orders/OrderCard';

export const RecentOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.getOrders().then((res) => setOrders(res.slice(0, 2)));
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
