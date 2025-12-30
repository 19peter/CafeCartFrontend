export interface Shop {
  id: number;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  isActive: boolean;
  isOnline: boolean;
  email: string;
}


export type Area = {
  id?: number;
  area: string;
  city: string;
  price: number;
};