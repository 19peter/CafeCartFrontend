export type RegisterCustomerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string; // YYYY-MM-DD
  phoneNumber: string; // e.g. 01012345678
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

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

  return result;
};


export const refreshToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
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

  setAuthToken(result.accessToken);
  return result.accessToken;
};

export const refreshTokenShop = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
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

  setShopToken(result.accessToken);
  return result.accessToken;
};

export const refreshTokenVendor = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
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

  setVendorToken(result.accessToken);
  return result.accessToken;
};


export const isTokenValid = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/is-token-valid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: getAuthToken() }),
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
};

export const authFetch = async (endpoint: string, method: string, data: any, retry = true) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      ...(method == 'GET' ? null : { body: JSON.stringify(data) }),
    });

    const res = await handleJson(response);

    if (res.status === 401 && retry) {
      const newToken = await refreshToken();

      if (!newToken) {
        logout();
        return res;
      }

      // Retry original request with new token
      const retryHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
      };

      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: retryHeaders,
        ...(method == 'GET' ? null : { body: JSON.stringify(data) }),
      });

      const retryResult = await handleJson(retryResponse);
      return retryResult;
    }

    return res;
  } catch (error) {
    // Handle network errors or other exceptions
    console.error('authFetch error:', error);
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

export const isAuthenticated = async () => {
  const token = getAuthToken();
  if (!token) return { valid: false, accessToken: null };
  try {
    const res = await isTokenValid();
    if (!res) {
      try {
        await refreshToken();
        return { valid: true, accessToken: getAuthToken() };
      } catch (_) {
        return { valid: false, accessToken: null };
      }
    }
    return { valid: true, accessToken: getAuthToken() };
  } catch (_) {
    return { valid: false, accessToken: null };
  }
};

export const isShopAuthenticated = async () => {
  const token = getShopToken();
  if (!token) return { valid: false, accessToken: null };
  try {
    const res = await isTokenValid();
    if (!res) {
      try {
        await refreshTokenShop();
        return { valid: true, accessToken: getShopToken() };
      } catch (_) {
        return { valid: false, accessToken: null };
      }
    }
    return { valid: true, accessToken: getShopToken() };
  } catch (_) {
    return { valid: false, accessToken: null };
  }
}; 

export const isVendorAuthenticated = async () => {
  const token = getVendorToken();
  if (!token) return { valid: false, accessToken: null };
  try {
    const res = await isTokenValid();
    if (!res) {
      try {
        await refreshTokenVendor();
        return { valid: true, accessToken: getVendorToken() };
      } catch (_) {
        return { valid: false, accessToken: null };
      }
    }
    return { valid: true, accessToken: getVendorToken() };
  } catch (_) {
    return { valid: false, accessToken: null };
  }
}; 

export const getAuthToken = () => localStorage.getItem('token');
export const getShopToken = () => localStorage.getItem('shopToken');
export const getVendorToken = () => localStorage.getItem('vendorToken');

export const setAuthToken = (token: string) => {
  token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
};

export const setShopToken = (token: string) => {
  token ? localStorage.setItem('shopToken', token) : localStorage.removeItem('shopToken');
};

export const setVendorToken = (token: string) => {
  token ? localStorage.setItem('vendorToken', token) : localStorage.removeItem('vendorToken');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('shopToken');
  localStorage.removeItem('vendorToken');
};


export const loginVendor = async (email: string, password: string) => {
  const res = await handleRequest('/auth/login/vendor', { email, password });
  if (res) {
    setVendorToken(res.accessToken);
    return res;
  }
  return null;
}

export const loginVendorShop = async (email: string, password: string) => {
  const res = await handleRequest('/auth/login/vendor-shop', { email, password });
  if (res) {
    setShopToken(res.accessToken);
    return res;
  }
  return null;
}

export const loginCustomer = async (email: string, password: string) => {
  const res = await handleRequest('/auth/login/customer', { email, password });
  if (res) {
    setAuthToken(res.accessToken);
    return res;
  }
  return null;
}

export const registerCustomer = (payload: RegisterCustomerPayload) =>
  handleRequest('/auth/register/customer', payload);
