import { authFetch } from "./authService";

export const verifyCustomer = async (customerId: number) => {
    const res = await authFetch(`/verify/shop/${customerId}`, 'POST', {}, true);
    return res;
};