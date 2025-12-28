export type ShopOrder = {
    id: number;
    orderNumber: string;
    orderType: orderType;
    paymentMethod: paymentMethod;
    status: orderStatus;
    customerId: number;
    customerName: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
    items: OrderItem[];
    totalPrice: number;
    createdAt: string;
    verified: boolean;
}

export type OrderItem = {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

type paymentMethod = "CASH" | "CREDIT_CARD";
type orderType = "PICKUP" | "DELIVERY" | "IN_HOUSE";
type orderStatus = "PENDING" | "PREPARING" | "READY_FOR_PICKUP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

