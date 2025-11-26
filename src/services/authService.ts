const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/auth';

const handleRequest = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }

  setAuthToken(result.token);
  setRefreshToken(result.refreshToken);
  return result;
};

export const loginVendor = (email: string, password: string) =>
  handleRequest('/login/vendor', { email, password });

export const loginVendorShop = (email: string, password: string) =>
  handleRequest('/login/vendor-shop', { email, password });

export const loginCustomer = (email: string, password: string) =>
  handleRequest('/login/customer', { email, password });

export const setAuthToken = (token: string) => {
  token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
};

export const setRefreshToken = (token: string) => {
  token ? localStorage.setItem('refreshToken', token) : localStorage.removeItem('refreshToken');
};

export const getAuthToken = () => localStorage.getItem('token');

export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const isAuthenticated = () => Boolean(getAuthToken());

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};
