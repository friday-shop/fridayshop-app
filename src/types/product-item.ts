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
}

export interface IProductItemProvider {
  providerId: string;
  id: string;
  isOpen: boolean;
}

export interface IProductItemProviderResponse extends IProductItemProvider {
  price?: number;
  name?: string;
  quantity?: number;
  purchasable?: number;
}
