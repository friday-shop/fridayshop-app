export interface IProductProvider {
  providerId: string;
  id: string;
  isOpen: boolean;
}

export interface IProduct {
  _id: string;
  categoryId: string;
  name: string;
  price: number;
  imageUrl?: string;
  providers: IProductProvider[];
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductProviderResponse extends IProductProvider {
  id: string;
  price: number;
  name: string;
  quantity: number;
  purchasable: number;
}

export interface IProductResponse {
  _id: string;
  isOpen: boolean;
  categoryId: string;
  name: string;
  price: number;
  imageUrl: string;
  providers: IProductProviderResponse[];
  createdAt: Date;
  updatedAt: Date;
  purchasable: number;
}
