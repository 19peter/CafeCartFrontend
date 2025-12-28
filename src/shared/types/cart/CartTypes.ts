
export interface OrderItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  productName: string;
  productImage: string;
}

export interface OrderSummary {
  orderType: string;
  paymentMethod: string;
  subTotal: number;
  deliveryFee: number;
  total: number;
  transactionFee: number;
  items: OrderItem[];
  shopName: string;
}

export interface CartSummary {
  id: number;
  customerId: number;
  vendorId: number;
  shopId: number;
  online: boolean;
  onlinePaymentAvailable: boolean;
  deliveryAvailable: boolean;
}

export interface OrderTypeBase {
  orderType: OrderType;
}

export interface OrderTypeBaseDelivery extends OrderTypeBase {
  deliveryAvailable: boolean;
  availableDeliveryAreas: DeliveryArea[];
  deliveryAreaId: number;
  price: number;
  area: string;
}

export interface OrderTypeBasePickup extends OrderTypeBase {
  pickupTime: string;
}

export interface OrderTypeBaseInHouse extends OrderTypeBase {
}

export interface DeliveryArea {
  id: number;
  area: string;
  price: number;

}

export type OrderType = 'PICKUP' | 'IN_HOUSE' | 'DELIVERY';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD';