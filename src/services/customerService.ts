import { authFetch } from "./authService";

export const verifyCustomer = async (customerId: number) => {
    const res = await authFetch(`/verify/shop/${customerId}`, 'POST', {}, true);
    return res;
};

export const getCustomerInfo = async () => {
    const res = await authFetch(`/customer/info`, 'GET', {}, true);
    return res;
};

export const updateCustomerPhone = async (info: any) => {
    const res = await authFetch(`/customer/phone`, 'POST', info, true);
    return res;
};

export const savePreferredAddress = async (address: string) => {
    const res = await authFetch(`/customer/address`, 'POST', { address }, true);
    return res;
};
