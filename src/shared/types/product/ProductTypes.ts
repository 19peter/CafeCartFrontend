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

export interface CreateProductDTO {
  name: string;
  price: number;
  imageUrl?: string;
  description: string;
  categoryId: number;
  isAvailable: boolean;
  isStockTracked: boolean;
  contentType?: string | null;
}

export interface UpdateProductDTO {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description: string;
  categoryId: number;
  isAvailable: boolean;
  isStockTracked: boolean;
  contentType?: string | null;
}
