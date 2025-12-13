import { authFetch } from './authService';

const BASE_URL = import.meta.env.VITE_VENDOR_SHOPS_BASE_URL || 'http://localhost:8080/api/v1';

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

// GET /vendor-shops/{vendorId}
export const getVendorShopsByVendorId = async (vendorId: number) => {
  const res = await fetch(`${BASE_URL}/vendor-shops/${vendorId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};

export const getShopName = async (vendorId: number) => {
  const res = await fetch(`${BASE_URL}/vendor-shops/${vendorId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};

export const getShopSettings = async () => {
  const res = await authFetch(`/vendor-shops/shop/settings`, 'GET', {}, true);
  return res;
};

export const setIsOnline = async (isOnline: boolean) => {
  const res = await authFetch(`/vendor-shops/shop/set-online`, 'PUT', { value: isOnline }, true);  
  return res;
}

export const setIsDeliveryAvailable = async (isDeliveryAvailable: boolean) => {
  const res = await authFetch(`/vendor-shops/shop/set-delivery`, 'PUT', { value: isDeliveryAvailable }, true);  
  return res;
}

export const setIsOnlinePaymentAvailable = async (isOnlinePaymentAvailable: boolean) => {
  const res = await authFetch(`/vendor-shops/shop/set-online-payment`, 'PUT', { value: isOnlinePaymentAvailable }, true);  
  return res;
}


  

  