export interface IProvider {
  _id: string;
  name: string;
  url: string;
  imageUrl?: string;
  isOpen: boolean;
  cookie: string;
  marker: string;
  subDomain: string;
  filterPasswords: string[];
  isFilterPasswords: boolean;
  createdAt: Date;
  updatedAt: Date;
  point?: number;
}

export interface IProviderProduct {
  id: string;
  price: number;
  name: string;
  quantity: number;
  purchasable: number;
}

export interface IProviderBuyProduct {
  id: string;
  raw: string;
  data: {
    email: string;
    pass: string | null;
  };
}

export interface IProviderCheckResponse {
  name: string;
  url: string;
  cookie: string;
  subDomain: string;
  point: number;
}
