import type { IProviderProduct } from './provider';

export interface IProductItem {
  _id: string;
  productId: string;
  name: string;
  expirationDays: number;
  price: number;
  imageUrl?: string;
  imagesWarningUrl?: string[];
  providers: IProductItemProviderResponse[];
  isOpen: boolean;
  sortOrder: number;
  isDiscount: boolean;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  purchasable?: number;
  quantity?: number;
  preSellItems?: string[];
}

export interface IProductItemProvider {
  providerId: string;
  id: string;
  variantId: string;
  isOpen: boolean;
  checkData?: IProviderCheckProduct;
}

export interface IProductItemProviderResponse extends IProductItemProvider {
  price?: number;
  name?: string;
  quantity?: number;
  purchasable?: number;
}

export interface IProviderCheckProduct {
  id: string;
  name: string;
  variants: IProviderProduct[];
}
