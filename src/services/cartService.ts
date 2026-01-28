import { authFetch } from './authService';


// GET /cart/get-cart with query params to keep it a true GET
export const getCart = async ({ orderType, paymentMethod, latitude, longitude, deliveryAreaId }: { orderType: string; paymentMethod: string; latitude: number; longitude: number; deliveryAreaId: number }): Promise<{ status: number, message: string, data: any }> => {
  const res = await authFetch(`/cart/get-cart`, 'POST', { orderType, paymentMethod, latitude, longitude, deliveryAreaId }, true);
  return res;
};

export const getShopName = async (): Promise<{ status: number, message: string, data: any }> => {
  const res = await authFetch(`/cart/get-cart-shop`, 'GET', {}, true);
  return res;
};

// POST /cart/add-to-cart
export const addToCart = async ({ shopId, quantity, productOptionId, additionsIds }: { shopId: number; quantity: number; productOptionId?: number; additionsIds?: number[] }): Promise<{ status: number, message: string, data: any }> => {
  const res = await authFetch(`/cart/add-to-cart`, 'POST', { shopId, quantity, productOptionId, additionsIds }, true);
  return res;
};

// POST /cart/remove-from-cart
export const removeFromCart = async ({ productOptionId, quantity }: { productOptionId: number; quantity: number }): Promise<{ status: number, message: string, data: any }> => {
  const res = await authFetch(`/cart/remove-from-cart`, 'POST', { productOptionId, quantity }, true);
  return res;
};


// POST /cart/add-one-to-cart
export const addOneToCart = async ({ cartItemId }: { cartItemId: number; }): Promise<{ status: number, message: string, data: any }> => {
  const res = await authFetch(`/cart/add-one-to-cart`, 'POST', { cartItemId }, true);
  return res;
};


// POST /cart/remove-one-from-cart
export const removeOneFromCart = async ({ cartItemId }: { cartItemId: number }): Promise<{ status: number, message: string, data: any }> => {
  const res = await authFetch(`/cart/remove-one-from-cart`, 'POST', { cartItemId }, true);
  return res;
};

// POST /cart/remove-item-from-cart
export const removeItemFromCart = async ({ cartItemId }: { cartItemId: number }): Promise<{ status: number, message: string, data: any }> => {
  const res = await authFetch(`/cart/remove-item-from-cart`, 'POST', { cartItemId }, true);
  return res;
};

