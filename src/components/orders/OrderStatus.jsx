import React from 'react';
import Badge from '../common/Badge';

export const OrderStatus = ({ status }) => {
  const getVariant = (s) => {
    switch (s) {
      case 'Delivered':
        return 'emerald';
      case 'Out for Delivery':
      case 'Preparing':
        return 'amber';
      case 'Cancelled':
        return 'rose';
      default:
        return 'slate';
    }
  };

  return <Badge variant={getVariant(status)}>{status}</Badge>;
};

export default OrderStatus;
