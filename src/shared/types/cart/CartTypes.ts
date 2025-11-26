
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
}


export type OrderType = 'PICKUP' | 'IN_HOUSE' | 'DELIVERY';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD';