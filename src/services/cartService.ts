import { getAuthToken } from './authService';
const CARTS_BASE_URL = import.meta.env.VITE_CARTS_BASE_URL || 'http://localhost:8080/api/v1/cart';

const authHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

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

const toQuery = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
};

// GET /carts/get-cart with query params to keep it a true GET
export const getCart = async ({ orderType, paymentMethod, latitude, longitude }: { orderType: string; paymentMethod: string; latitude: number; longitude: number }): Promise<{ status: number, message: string, data: any }> => {
  // console.log(authHeaders())
  const res = await fetch(`${CARTS_BASE_URL}/get-cart`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ orderType, paymentMethod, latitude, longitude }),
  });
  return handleJson(res);
};

// POST /carts/add-to-cart
export const addToCart = async ({ productId, shopId, quantity }: { productId: number; shopId: number; quantity: number }): Promise<{ status: number, message: string, data: any }> => {

  const res = await fetch(`${CARTS_BASE_URL}/add-to-cart`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ productId, shopId, quantity }),
  });
  return handleJson(res);

};

// POST /carts/remove-from-cart
export const removeFromCart = async ({ productId, quantity }: { productId: number; quantity: number }): Promise<{ status: number, message: string, data: any }> => {

  const res = await fetch(`${CARTS_BASE_URL}/remove-from-cart`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });
  return handleJson(res);

};


// POST /cart/add-one-to-cart
export const addOneToCart = async ({ productId, shopId }: { productId: number; shopId: number }): Promise<{ status: number, message: string, data: any }> => {

  const res = await fetch(`${CARTS_BASE_URL}/add-one-to-cart`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ productId, shopId, quantity: 1 }),
  });
  return handleJson(res);

};


// POST /cart/remove-one-from-cart
export const removeOneFromCart = async ({ cartItemId }: { cartItemId: number }): Promise<{ status: number, message: string, data: any }> => {

  const res = await fetch(`${CARTS_BASE_URL}/remove-one-from-cart`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ cartItemId }),
  });
  return handleJson(res);

};

// POST /cart/remove-item-from-cart
export const removeItemFromCart = async ({ cartItemId }: { cartItemId: number }): Promise<{ status: number, message: string, data: any }> => {

  const res = await fetch(`${CARTS_BASE_URL}/remove-item-from-cart`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ cartItemId }),
  });
  console.log(res)
  return handleJson(res);

};

