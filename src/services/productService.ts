import type { CreateProductDTO, UpdateProductDTO } from "../shared/types/product/ProductTypes";
import { authFetch } from "./authService";

const BASE_URL = import.meta.env.VITE_INVENTORY_BASE_URL || 'http://localhost:8080/api/v1/products';

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


export const getShopCategories = async ({ shopId }: { shopId: number }) => {
  const res = await fetch(`${BASE_URL}/vendor/${shopId}/categories`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};

export const getAllCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};

export const getVendorProducts = async () => {
  const res = await authFetch(`/products/vendor`, 'GET', {}, true);
  return res;
};

export const saveProductImage = async (productId: number, uploadUrl: string) => {
  const res = await authFetch(`/products/vendor/product-image`, 'POST', { productId, uploadUrl }, true);
  return res;
}

export const createProduct = async (product: CreateProductDTO) => {
  const res = await authFetch(`/products/vendor/add`, 'POST', product, true);
  return res;
}

export const updateProduct = async (product: UpdateProductDTO) => {
  const res = await authFetch(`/products/vendor/update`, 'POST', product, true);
  return res;
}
