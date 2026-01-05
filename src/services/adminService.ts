import { authFetch } from './authService';

export interface Vendor {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    createdAt: string;
    totalShops: number;
    imageUrl?: string;
}

export interface CreatedVendorDto {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    vaaEmail: string;
    uploadUrl?: string;
    contentType?: string | null;
}

export interface AdminShop {
    id: number;
    name: string;
    address: string;
    city: string;
    phoneNumber: string;
    isActive: boolean;
    isOnline: boolean;
    email: string;
    vendorName: string;
}

export interface Category {
    id: number;
    name: string;
}

export const adminService = {
    getVendors: async (): Promise<Vendor[]> => {
        const response = await authFetch('/vendors/admin', 'GET', null);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error(response.message || 'Failed to fetch vendors');
    },

    addVendor: async (vendor: {
        name: string;
        email: string;
        phoneNumber: string;
        vaaEmail: string;
        vaaPassword: string;
        imageUrl?: string;
        contentType?: string | null;
    }): Promise<CreatedVendorDto> => {
        const response = await authFetch('/vendors/admin/create', 'POST', vendor);
        if (response.status === 200 || response.status === 201) {
            return response.data;
        }
        throw new Error(response.message || 'Failed to create vendor');
    },

    getAllShops: async (): Promise<AdminShop[]> => {
        const response = await authFetch('/vendor-shops/admin', 'GET', null);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error(response.message || 'Failed to fetch shops');
    },

    getCategories: async (): Promise<Category[]> => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/products/categories`);
        const result = await response.json();
        if (response.ok) {
            return result;
        }
        throw new Error(result.message || 'Failed to fetch categories');
    },

    addCategory: async (category: { name: string }): Promise<Category> => {
        const response = await authFetch('/products/admin/categories', 'POST', category);
        if (response.status === 200 || response.status === 201) {
            return response.data;
        }
        throw new Error(response.message || 'Failed to add category');
    }
};
