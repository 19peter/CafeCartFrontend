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

export interface Addition {
  id: number;
  name: string;
  price: number;
  groupIds: number[];
}

export interface AdditionGroup {
  id: number;
  name: string;
  vendorId: number;
}

export interface CreateAdditionRequest {
  name: string;
  price: number;
  groupIds: number[];
}

export interface CreateAdditionGroupRequest {
  name: string;
}

// Mock Data
let mockGroups: AdditionGroup[] = [
  { id: 1, name: "Dairy Options", vendorId: 1 },
  { id: 2, name: "Sweeteners", vendorId: 1 },
  { id: 3, name: "Size Upgrades", vendorId: 1 }
];

let mockAdditions: Addition[] = [
  { id: 1, name: "Whole Milk", price: 5, groupIds: [1] },
  { id: 2, name: "Almond Milk", price: 10, groupIds: [1] },
  { id: 3, name: "Honey", price: 3, groupIds: [2] },
  { id: 4, name: "Large Size", price: 15, groupIds: [3] }
];

export const getAdditionGroups = async () => {
  // return await authFetch(`/vendors/vendor/addition-groups`, 'GET', {}, true);
  return { status: 200, data: mockGroups };
};

export const getAdditions = async () => {
  // return await authFetch(`/vendors/vendor/additions`, 'GET', {}, true);
  return { status: 200, data: mockAdditions };
};

export const addAdditionGroup = async (dto: CreateAdditionGroupRequest) => {
  // return await authFetch(`/vendors/vendor/addition-groups/add`, 'POST', dto, true);
  const newGroup = { id: Date.now(), name: dto.name, vendorId: 1 };
  mockGroups.push(newGroup);
  return { status: 200, data: newGroup };
};

export const addAddition = async (dto: CreateAdditionRequest) => {
  // return await authFetch(`/vendors/vendor/additions/add`, 'POST', dto, true);
  const newAddition = { id: Date.now(), ...dto };
  mockAdditions.push(newAddition);
  return { status: 200, data: newAddition };
};

export const updateAdditionGroup = async (dto: AdditionGroup) => {
  // return await authFetch(`/vendors/vendor/addition-groups`, 'PUT', dto, true);
  mockGroups = mockGroups.map(g => g.id === dto.id ? dto : g);
  return { status: 200, data: dto };
};

export const updateAddition = async (dto: Addition) => {
  // return await authFetch(`/vendors/vendor/additions`, 'PUT', dto, true);
  mockAdditions = mockAdditions.map(a => a.id === dto.id ? dto : a);
  return { status: 200, data: dto };
};

export const linkAdditionToGroup = async (additionId: number, groupId: number) => {
  // return await authFetch(`/vendors/vendor/additions/${additionId}/link/${groupId}`, 'POST', {}, true);
  mockAdditions = mockAdditions.map(a =>
    a.id === additionId ? { ...a, groupIds: [...new Set([...a.groupIds, groupId])] } : a
  );
  return { status: 200 };
};
