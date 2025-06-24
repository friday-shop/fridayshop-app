export interface ICategory {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}
