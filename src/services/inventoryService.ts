import { authFetch } from "./authService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const handleJson = async (response: any) => {
  let result;
  try {
    result = await response.json();
  } catch (_) {
    result = null;
  }
  if (!response.ok) {
    const message = (result && (result.message || result.error)) || 'Request failed';
    const error = new Error(message);
    error.name = response.status;
    error.message = result;
    throw error;
  }
  return result;
};

const toQuery = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
};

// GET /inventory/vendor/{vendorId}
export const getVendorShopInventoryByCategory = async ({ shopId, quantity, page, size, category }: { shopId: number; quantity?: number; page?: number; size?: number; category: string }) => {
  const qs = toQuery({ quantity, page, size, category });
  const res = await fetch(`${BASE_URL}/inventory/vendor/${shopId}${qs}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('Inventory:', res);
  return handleJson(res);
};

// GET /inventory/vendor/{vendorId}/product/{productId}
export const getVendorProduct = async ({ vendorShopId, productId }: { vendorShopId: number; productId: number }) => {
  const res = await fetch(`${BASE_URL}/inventory/vendor/${vendorShopId}/product/${productId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};


export const updateInventory = async ({ vendorShopId, productId, quantity }: { vendorShopId: number; productId: number; quantity: number }) => {
  const res = await authFetch(`/inventory/shop/update/${vendorShopId}/${productId}/${quantity}`, 'POST', {}, true);
  return res;
};



