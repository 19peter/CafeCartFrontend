import { authFetch } from "./authService";

/**
 * Addition Interface (Vendor Level)
 */
export interface Addition {
    id: number;
    name: string;
    price: number;
}

/**
 * Addition Group Interface (Vendor Level)
 */
export interface AdditionGroup {
    id: number;
    name: string;
    vendorId: number;
    maxSelectable: number;
}

/**
 * Shop Addition Interface (Inherited Addition with local availability)
 */
export interface ShopAddition {
    id: number;
    name: string;
    price: number;
    isAvailable: boolean;
    groupId: number;
    groupName: string;
}

// --- Vendor Management (ROLE_VENDOR) ---

/**
 * List all addition groups for the current vendor
 */
export const getAdditionGroups = async () => {
    return await authFetch(`/addition-groups/vendor`, 'GET', {}, true);
};

/**
 * Create a new addition group
 */
export const createAdditionGroup = async (name: string, maxSelectable: number = 1) => {
    return await authFetch(`/addition-groups/vendor`, 'POST', { name, maxSelectable }, true);
};

/**
 * Get details for a specific addition group
 */
export const getAdditionGroupById = async (id: number) => {
    return await authFetch(`/addition-groups/${id}`, 'GET', {}, true);
};

/**
 * Update an addition group
 */
export const updateAdditionGroup = async (id: number, name: string, maxSelectable: number = 1) => {
    return await authFetch(`/addition-groups/vendor/${id}`, 'PUT', { name, maxSelectable }, true);
};

/**
 * Delete an addition group
 */
export const deleteAdditionGroup = async (id: number) => {
    return await authFetch(`/addition-groups/vendor/${id}`, 'DELETE', {}, true);
};

/**
 * List additions in a group
 */
export const getAdditionsByGroup = async (groupId: number) => {
    return await authFetch(`/addition-groups/vendor/${groupId}/additions`, 'GET', {}, true);
};

/**
 * Create a master addition in a group
 */
export const createAddition = async (groupId: number, data: { name: string; price: number }) => {
    return await authFetch(`/addition-groups/vendor/${groupId}/additions`, 'POST', data, true);
};

/**
 * Update a master addition
 */
export const updateAddition = async (id: number, data: { name: string; price: number }) => {
    return await authFetch(`/addition-groups/vendor/additions/${id}`, 'PUT', data, true);
};

/**
 * Delete a master addition (syncs to all shops)
 */
export const deleteAddition = async (id: number) => {
    return await authFetch(`/addition-groups/vendor/additions/${id}`, 'DELETE', {}, true);
};

// --- Product Linking ---

/**
 * Link an addition group to a product
 */
export const linkGroupToProduct = async (productId: number, groupId: number) => {
    return await authFetch(`/products/vendor/${productId}/addition-groups/${groupId}`, 'POST', {}, true);
};

/**
 * Unlink an addition group from a product
 */
export const unlinkGroupFromProduct = async (productId: number, groupId: number) => {
    return await authFetch(`/products/vendor/${productId}/addition-groups/${groupId}`, 'DELETE', {}, true);
};

/**
 * List groups assigned to a product
 */
export const getProductAdditionGroups = async (productId: number) => {
    return await authFetch(`/products/vendor/${productId}/addition-groups`, 'GET', {}, true);
};

// --- Shop Management (ROLE_SHOP) ---

/**
 * List all inherited additions for this shop
 */
export const getShopAdditions = async () => {
    return await authFetch(`/shop-additions/shop`, 'GET', {}, true);
};

/**
 * Toggle availability of an addition in the local shop
 */
export const toggleAdditionAvailability = async (id: number, isAvailable: boolean) => {
    return await authFetch(`/shop-additions/shop/${id}/availability?isAvailable=${isAvailable}`, 'PUT', {}, true);
};
