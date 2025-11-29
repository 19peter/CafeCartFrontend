import type { OrderType, PaymentMethod } from '../shared/types/cart/CartTypes';
import { authFetch } from './authService';

// GET /orders/shop
export const getShopOrders = async () => {
  const res = await authFetch(`/orders/shop`, 'GET', {}, true);
  return res;
};

// GET /orders/customer
export const getCustomerOrders = async () => {
  const res = await authFetch(`/orders/customer`, 'GET', {}, true);
  return res;
};

// GET /orders/order/items
export const getOrderItems = async () => {
  const res = await authFetch(`/orders/order/items`, 'GET', {}, true);
  return res;
};

// POST /orders/update-order
export const updateOrder = async ({ orderId }: { orderId: number }) => {
  const res = await authFetch(`/orders/update-order`, 'POST', { orderId }, true);
  return res;
};

// POST /orders
export const createOrder = async (
  { orderType, paymentMethod, latitude, longitude }: { orderType: OrderType; paymentMethod: PaymentMethod; latitude: number; longitude: number },
) => {
  const res = await authFetch(`/orders`, 'POST', { orderType, paymentMethod, latitude, longitude }, true);
  return res;
};
