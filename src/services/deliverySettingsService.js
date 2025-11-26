const BASE_URL = import.meta.env.VITE_DELIVERY_SETTINGS_BASE_URL || 'http://localhost:8080/api/v1';

const handleJson = async (response) => {
  let result;
  try {
    result = await response.json();
  } catch (_) {
    result = null;
  }
  if (!response.ok) {
    const message = (result && (result.message || result.error)) || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.data = result;
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

// GET /api/v1/delivery-settings
export const getDeliverySettings = async ({ latitude, longitude, shopId }) => {
  const qs = toQuery({ latitude, longitude, shopId });
  const res = await fetch(`${BASE_URL}/delivery-settings${qs}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleJson(res);
};
