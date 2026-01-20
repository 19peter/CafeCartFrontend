export type RegisterCustomerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string; // YYYY-MM-DD
  phoneNumber: string; // e.g. 01012345678
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const TOKEN_KEYS = {
  CUSTOMER: 'token',
  SHOP: 'shopToken',
  VENDOR: 'vendorToken',
  ADMIN: 'adminToken'
};

const handleRequest = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
};

// In-Memory Store
const memoryStore: Record<string, string | null> = {
  [TOKEN_KEYS.CUSTOMER]: null,
  [TOKEN_KEYS.SHOP]: null,
  [TOKEN_KEYS.VENDOR]: null,
  [TOKEN_KEYS.ADMIN]: null,
};

// Generic Helpers
const getToken = (key: string) => memoryStore[key];
const setToken = (key: string, token: string) => {
  memoryStore[key] = token || null;
};

export const getAuthToken = () => getToken(TOKEN_KEYS.CUSTOMER);
export const getShopToken = () => getToken(TOKEN_KEYS.SHOP);
export const getVendorToken = () => getToken(TOKEN_KEYS.VENDOR);
export const getAdminToken = () => getToken(TOKEN_KEYS.ADMIN);

export const setAuthToken = (token: string) => setToken(TOKEN_KEYS.CUSTOMER, token);
export const setShopToken = (token: string) => setToken(TOKEN_KEYS.SHOP, token);
export const setVendorToken = (token: string) => setToken(TOKEN_KEYS.VENDOR, token);
export const setAdminToken = (token: string) => setToken(TOKEN_KEYS.ADMIN, token);

const performRefreshToken = async (tokenKey: string, endpoint: string = '/auth/refresh-token') => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }

  const token = result.accessToken || result.token || result.jwt;
  if (token) {
    setToken(tokenKey, token);
  }
  return token;
};

export const refreshToken = () => performRefreshToken(TOKEN_KEYS.CUSTOMER, '/auth/refresh-token');
export const refreshTokenShop = () => performRefreshToken(TOKEN_KEYS.SHOP, '/auth/refresh-token-shop');
export const refreshTokenVendor = () => performRefreshToken(TOKEN_KEYS.VENDOR, '/auth/refresh-token-vendor');
export const refreshTokenAdmin = () => performRefreshToken(TOKEN_KEYS.ADMIN, '/auth/refresh-token-admin');

const getCurrentRoleHelpers = () => {
  if (typeof window === 'undefined') return { get: getAuthToken, refresh: refreshToken };
  const hostname = window.location.hostname;
  if (hostname.includes("shop")) return { get: getShopToken, refresh: refreshTokenShop };
  if (hostname.includes("vendor")) return { get: getVendorToken, refresh: refreshTokenVendor };
  if (hostname.includes("admin")) return { get: getAdminToken, refresh: () => Promise.resolve("") };
  return { get: getAuthToken, refresh: refreshToken };
};

export const isTokenValid = async (token?: string | null) => {
  const tokenToCheck = token || getCurrentRoleHelpers().get();
  if (!tokenToCheck) return { valid: false };

  const response = await fetch(`${API_BASE_URL}/auth/is-token-valid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: tokenToCheck }),
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
};

export const authFetch = async (endpoint: string, method: string, data: any, retry = true, additionalHeaders: any = {}) => {
  const helpers = getCurrentRoleHelpers();
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${helpers.get()}`,
      ...additionalHeaders
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      ...(method == 'GET' ? null : { body: JSON.stringify(data) }),
    });

    // Check status before parsing to avoid logging error
    if (response.status === 401 && retry) {
      const newToken = await helpers.refresh();

      if (!newToken) {
        logout(getCurrentRoleName());
        return {
          data: null,
          message: 'Unauthorized',
          status: 401
        };
      }

      // Retry original request with new token
      const retryHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
        ...additionalHeaders
      };

      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: retryHeaders,
        ...(method == 'GET' ? null : { body: JSON.stringify(data) }),
      });

      const retryResult = await handleJson(retryResponse);
      return retryResult;
    }

    const res = await handleJson(response);
    return res;
  } catch (error) {
    return {
      data: null,
      message: error instanceof Error ? error.message : 'Network error',
      status: 0
    };
  }
};

const handleJson = async (response: { json: () => Promise<any>, ok: boolean, status: number }) => {
  let result;
  try {
    result = await response.json();
  } catch (_) {
    result = null;
  }

  if (!response.ok) {
    const message = (result && (result.message || result.error)) || 'Request failed';
    return { data: result, message, status: response.status };
  }

  return { data: result, message: "success", status: response.status };
};

const checkAuthenticated = async (tokenGetter: () => string | null, tokenRefresher: () => Promise<string>) => {
  let token = tokenGetter();

  // 1. If we have a token, check if it's still valid
  if (token) {
    try {
      const res = await isTokenValid(token);
      if (res && res.valid) {
        return { valid: true, accessToken: token };
      }
    } catch (_) {
      // Token likely expired, proceed to refresh
    }
  }

  // 2. No token or invalid token: Try to refresh using HTTP-only cookie
  try {
    const newToken = await tokenRefresher();
    if (newToken) {
      return { valid: true, accessToken: newToken };
    }
  } catch (_) {
    // Refresh failed or no cookie present
  }

  return { valid: false, accessToken: null };
};

export const isAuthenticated = () => checkAuthenticated(getAuthToken, refreshToken);
export const isShopAuthenticated = () => checkAuthenticated(getShopToken, refreshTokenShop);
export const isVendorAuthenticated = () => checkAuthenticated(getVendorToken, refreshTokenVendor);
export const isAdminAuthenticated = () => checkAuthenticated(getAdminToken, refreshTokenAdmin);

const getCurrentRoleName = (): keyof typeof TOKEN_KEYS => {
  if (typeof window === 'undefined') return 'CUSTOMER';
  const hostname = window.location.hostname;
  if (hostname.includes("shop")) return 'SHOP';
  if (hostname.includes("vendor")) return 'VENDOR';
  if (hostname.includes("admin")) return 'ADMIN';
  return 'CUSTOMER';
};

export const logout = (role?: keyof typeof TOKEN_KEYS) => {
  const roleName = role || getCurrentRoleName();
  const key = TOKEN_KEYS[roleName];
  memoryStore[key] = null;
  localStorage.removeItem(key); // Cleanup legacy if exists
};

export const logoutAll = () => {
  Object.keys(memoryStore).forEach(key => memoryStore[key] = null);
  Object.values(TOKEN_KEYS).forEach(key => localStorage.removeItem(key));
};

export const loginVendor = async (email: string, password: string) => {
  return handleRequest('/auth/login/vendor', { email, password });
}

export const loginVendorShop = async (email: string, password: string) => {
  return handleRequest('/auth/login/vendor-shop', { email, password });
}

export const loginCustomer = async (email: string, password: string) => {
  return handleRequest('/auth/login/customer', { email, password });
}

export const loginAdmin = async (email: string, password: string) => {
  return handleRequest('/auth/login/admin', { email, password });
}

export const registerCustomer = (payload: RegisterCustomerPayload) => handleRequest('/auth/register/customer', payload);

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password?email=${encodeURIComponent(email)}`, {
    method: 'POST',
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Request failed');
    throw new Error(errorText);
  }
  return response.text();
};

export const resetPassword = async (token: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(password)}`, {
    method: 'POST',
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Request failed');
    throw new Error(errorText);
  }
  return response.text();
};
