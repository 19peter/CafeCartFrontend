import type { OrderType, PaymentMethod } from '../shared/types/cart/CartTypes';
import { authFetch } from './authService';

// GET /orders/shop
export const getShopOrders = async (date?: string) => {
  const params = date
    ? `?date=${encodeURIComponent(date)}`
    : "";

  return authFetch(`/orders/shop/${params}`, "GET", {}, true);
};

// GET /orders/customer
export const getCustomerOrders = async () => {
  const res = await authFetch(`/orders/customer`, 'GET', {}, true);
  return res;
};

export const getVendorOrders = async (year: number, month: number, page: number, size: number, shopId: number) => {
  const res = await authFetch(`/orders/vendor/month?year=${year}&month=${month}&page=${page}&size=${size}&shopId=${shopId}`, 'GET', {}, true);
  return res;
};

export const getSaleSummaryByMonth = async (year: number, month: number, shopId: number) => {
  const res = await authFetch(`/orders/vendor/month/total?year=${year}&month=${month}&shopId=${shopId}`, 'GET', {}, true);
  return res;
};

// GET /orders/customer/items
export const getOrderItems = async () => {
  const res = await authFetch(`/orders/customer/items`, 'GET', {}, true);
  return res;
};

// POST /orders/customer
export const createOrder = async (
  { orderType, paymentMethod, latitude, longitude, address, pickupTime, deliveryAreaId, idempotencyKey }:
   { orderType: OrderType; paymentMethod: PaymentMethod; latitude: number; longitude: number; address: string; pickupTime: string; deliveryAreaId: number; idempotencyKey: string },
) => {
  const res = await authFetch(`/orders/customer`,
    'POST',
    { orderType, paymentMethod, latitude, longitude, address, pickupTime, deliveryAreaId },
     true,
     { 'Idempotency-Key': idempotencyKey });
  return res;
};

// POST /orders/update-order
export const updateOrderStatus = async ({ orderId }: { orderId: number }) => {
  const res = await authFetch(`/orders/shop/update-order`, 'POST', { orderId }, true);
  return res;
};

export const cancelOrder = async ({ orderId }: { orderId: number }) => {
  const res = await authFetch(`/orders/shop/cancel-order`, 'POST', { orderId }, true);
  return res;
};


