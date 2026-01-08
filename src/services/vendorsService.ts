import { authFetch } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

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

// GET /vendors?page=&size=
export const getVendors = async ({ page = 0, size = 10 } = {}) => {
  const qs = toQuery({ page, size });
  const res = await fetch(`${API_BASE_URL}/vendors${qs}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return await handleJson(res);
};

// GET /vendors/{vendorId}
export const getVendorById = async (vendorId: number) => {
  const res = await fetch(`${API_BASE_URL}/vendors/${vendorId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return await handleJson(res);
};

export const getVendorInfo = async () => {
  const res = await authFetch(`/vendors/vendor`, 'GET', {}, true);
  return res;
};

export interface CreateShopRequest {
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
  password: string;
  vendorId: number;
}

export interface UpdateShopRequest {
  id: number;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  isActive: boolean;
}

export const getVendorShopsDetails = async () => {
  const res = await authFetch(`/vendors/vendor/shops`, 'GET', {}, true);
  return res;
};

export const addShop = async (addShopDto: CreateShopRequest) => {
  const res = await authFetch(`/vendors/vendor/shops/add`, 'POST', addShopDto, true);
  return res;
};

export const updateShop = async (updateShopDto: UpdateShopRequest) => {
  const res = await authFetch(`/vendors/vendor/shops`, 'PUT', updateShopDto, true);
  return res;
};
