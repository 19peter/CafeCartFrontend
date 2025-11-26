const BASE_URL = import.meta.env.VITE_INVENTORY_BASE_URL || 'http://localhost:8080/api/v1/inventory';

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
  const res = await fetch(`${BASE_URL}/vendor/${shopId}${qs}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('Inventory:', res);
  return handleJson(res);
};

// GET /inventory/vendor/{vendorId}/product/{productId}
export const getVendorProduct = async ({ vendorShopId, productId }: { vendorShopId: number; productId: number }) => {
  const res = await fetch(`${BASE_URL}/vendor/${vendorShopId}/product/${productId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};

// GET /inventory/vendor/{shopId}/categories
export const getShopCategories = async ({ shopId }: { shopId: number }) => {
  const res = await fetch(`${BASE_URL}/vendor/${shopId}/categories`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};

