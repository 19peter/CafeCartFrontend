export interface Product {
    id: number;
    vendorShopId: number;
    productId: number;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    quantity: number;
    categoryId: number;
    categoryName: string;
    isStockTracked: boolean;
    isAvailable: boolean;
}