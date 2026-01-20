export const ProductSizes = {
  DEFAULT: 'DEFAULT',
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE'
} as const;

export type ProductSizes = (typeof ProductSizes)[keyof typeof ProductSizes];

export interface ProductOption {
  id?: number | null;
  size: ProductSizes;
  price: number;
  isDeleted?: boolean | null;
}

export interface Product {
  id: number;
  vendorShopId: number;
  productId: number;
  name: string;
  imageUrl: string;
  description: string;
  quantity: number;
  categoryId: number;
  categoryName: string;
  isStockTracked: boolean;
  isAvailable: boolean;
  additionGroupIds: number[];
  additionGroups?: { id: number; name: string }[];
  options: ProductOption[];
  hasDefaultSize?: boolean; // Optional in case backend doesn't send it at top level
}

export interface ProductOptionInfo {
  optionList: ProductOption[];
  hasDefaultSize: boolean;
}

export interface CreateProductDTO {
  name: string;
  imageUrl?: string;
  description: string;
  categoryId: number;
  isAvailable: boolean;
  isStockTracked: boolean;
  contentType?: string | null;
  additionGroupIds: number[];
  options: ProductOptionInfo;
}

export interface UpdateProductDTO {
  id: number;
  name: string;
  imageUrl?: string;
  description: string;
  categoryId: number;
  isAvailable: boolean;
  isStockTracked: boolean;
  contentType?: string | null;
  additionGroupIds: number[];
  options: ProductOptionInfo;
}
