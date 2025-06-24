export interface IProvider {
  _id: string;
  name: string;
  url: string;
  imageUrl?: string;
  isOpen: boolean;
  cookie: string;
  subDomain: string;

  createdAt: Date;
  updatedAt: Date;
}
