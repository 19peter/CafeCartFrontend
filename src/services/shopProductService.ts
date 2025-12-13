const BASE_URL = import.meta.env.VITE_INVENTORY_BASE_URL || 'http://localhost:8080/api/v1/shop-products';

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

// GET /shop-product/vendor/{vendorId}
export const getVendorShopProducts = async ({ shopId }: { shopId: number }) => {
  const res = await fetch(`${BASE_URL}/vendor/${shopId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};

// GET /shop-product/vendor/{vendorId}/product/{productId}
export const getVendorProduct = async ({ vendorShopId, productId }: { vendorShopId: number; productId: number }) => {
  const res = await fetch(`${BASE_URL}/vendor/${vendorShopId}/product/${productId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};


