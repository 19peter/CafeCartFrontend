import { authFetch } from "./authService";

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

export const getAllForVendor = async () => {
  const res = await authFetch(`/shop-products/vendor`, 'GET', {}, false);
  return res;
};

export const getShopProducts = async () => {
  const res = await authFetch(`/shop-products/shop`, 'GET', {}, true);
  return res;
};

export const publishProduct = async ({ productId }: { productId: number }) => {
  const res = await authFetch(`/shop-products/shop/publish/product/${productId}`, 'POST', {}, true);
  return res;
};

export const unpublishProduct = async ({ productId }: { productId: number }) => {
  const res = await authFetch(`/shop-products/shop/unpublish/product/${productId}`, 'POST', {}, true);
  return res;
};

// GET /shop-product/vendor/{vendorId}
export const getVendorShopProducts = async ({ shopId }: { shopId: number }) => {
  const res = await fetch(`${BASE_URL}/${shopId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};

// GET /shop-product/vendor/{vendorId}/product/{productId}
export const getVendorProduct = async ({ vendorShopId, productId }: { vendorShopId: number; productId: number }) => {
  const res = await fetch(`${BASE_URL}/${vendorShopId}/product/${productId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};


