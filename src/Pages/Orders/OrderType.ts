export type Order = {
    id: string;
    orderType: string;
    paymentMethod: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    status: string;
    paymentStatus: string;
    orderNumber: string;
}

export type OrderItem = {
    id: string;
    quantity: number;
    price: number;
    name: string;
    image?: string;
}