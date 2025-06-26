export interface ICategory {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isOpen: boolean;
  isUseForm: boolean;
  formFormat?: string;
  createdAt: Date;
  updatedAt: Date;
}
