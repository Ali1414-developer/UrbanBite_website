import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import OrderCard from '../components/orders/OrderCard';
import orderService from '../services/orderService';
import EmptyState from '../components/common/EmptyState';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders().then((res) => {
      setOrders(res);
      setIsLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <PageContainer>
        <h1 className="text-2xl font-black text-slate-900 border-b border-slate-200 pb-4 mb-8">
          Order History
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No past orders found"
            description="You haven't placed any orders yet. Check out our menu to order your first meal!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </PageContainer>
    </main>
  );
};

export default Orders;
