export type RegisterCustomerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string; // YYYY-MM-DD
  phoneNumber: string; // e.g. 01012345678
};

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/auth';

const handleJson = async (response: Response) => {
  let result: any = null;
  try {
    result = await response.json();
  } catch (_) {
    // ignore
  }
  if (!response.ok) {
    const message = (result && (result.message || result.error)) || 'Request failed';
    const error: any = new Error(message);
    error.status = response.status;
    error.data = result;
    throw error;
  }
  return result;
};

export const registerCustomer = async (payload: RegisterCustomerPayload) => {
  const res = await fetch(`${AUTH_BASE_URL}/register/customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleJson(res);
};
