import type { OrderType, PaymentMethod } from '../shared/types/cart/CartTypes';
import { getAuthToken } from './authService';

const BASE_URL = import.meta.env.VITE_ORDERS_BASE_URL || 'http://localhost:8080/api/v1/orders';

const handleJson = async (response: { json: () => Promise<any>, ok: boolean, status: number }) => {
  let result;
  try {
    result = await response.json();
  } catch (_) {
    result = null;
  }
  if (!response.ok) {
    const message = (result && (result.message || result.error)) || 'Request failed';
    // const error = new Error(message);
    // error.name = response.status;
    // error.message = result;
    return {data: result, message, status: response.status };
  }
  return {data: result, "message": "success", status: response.status };
};

const authHeaders = () => {
  const token =  getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// GET /orders/shop
export const getShopOrders = async () => {
  const res = await fetch(`${BASE_URL}/shop`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return handleJson(res);
};

// GET /orders/customer
export const getCustomerOrders = async () => {
  const res = await fetch(`${BASE_URL}/customer`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return handleJson(res);
};

// GET /orders/order/items
export const getOrderItems = async () => {
  const res = await fetch(`${BASE_URL}/order/items`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return handleJson(res);
};

// POST /orders/update-order
export const updateOrder = async ({ orderId }: { orderId: number }) => {
  const res = await fetch(`${BASE_URL}/update-order`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ orderId }),
  });
  return handleJson(res);
};

// POST /orders
export const createOrder = async (
  { orderType, paymentMethod, latitude, longitude }: { orderType: OrderType; paymentMethod: PaymentMethod; latitude: number; longitude: number },
) => {
  const res = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ orderType, paymentMethod, latitude, longitude }),
  });
  return handleJson(res);
};
