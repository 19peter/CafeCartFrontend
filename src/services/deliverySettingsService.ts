import { authFetch } from "./authService";
import type { Area } from "../shared/types/Shop/Shop";

export const addDeliveryArea = async (area: Area) => {
  const res = await authFetch('/delivery-settings/shop/area', 'POST', area, true);
  return res;
};

export const getDeliveryAreas = async () => {
  const res = await authFetch('/delivery-settings/shop/area', 'GET', {}, true);
  return res;
};

export const updateDeliveryArea = async (area: Area) => {
  const res = await authFetch('/delivery-settings/shop/area', 'PUT', area, true);
  return res;
};

export const deleteDeliveryArea = async (area: Area) => {
  const res = await authFetch('/delivery-settings/shop/area', 'DELETE', area , true);
  return res;
};
