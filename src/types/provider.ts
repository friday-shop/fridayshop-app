export interface IProvider {
  _id: string;
  name: string;
  url: string;
  imageUrl?: string;
  isOpen: boolean;
  cookie: string;
  subDomain: string;
  filterPasswords: string[];
  createdAt: Date;
  updatedAt: Date;
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
