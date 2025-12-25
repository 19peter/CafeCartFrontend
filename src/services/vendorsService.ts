import { authFetch } from "./authService";

const BASE_URL = import.meta.env.VITE_VENDORS_BASE_URL || 'http://localhost:8080/api/v1/vendors';

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
  const res = await fetch(`${BASE_URL}${qs}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return await handleJson(res);
};

// GET /vendors/{vendorId}
export const getVendorById = async (vendorId: number) => {
  const res = await fetch(`${BASE_URL}/${vendorId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return await handleJson(res);
};

export const getVendorInfo = async () => {
  const res = await authFetch(`/vendors/vendor`, 'GET', {}, true);
  return res;
};
