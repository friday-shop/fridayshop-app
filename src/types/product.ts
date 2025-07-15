export interface IProductProvider {
  providerId: string;
  id: string;
  isOpen: boolean;
}

export interface IProduct {
  _id: string;
  isOpen: boolean;
  categoryId: string;
  name: string;
  price: number;
  imageUrl: string;
  providers: IProductProviderResponse[];
  createdAt: Date;
  updatedAt: Date;
  purchasable?: number;
  quantity?: number;
  expirationDays: number;
  imagesWarningUrl?: string[];
}

export interface IProductProviderResponse extends IProductProvider {
  price?: number;
  name?: string;
  quantity?: number;
  purchasable?: number;
}
