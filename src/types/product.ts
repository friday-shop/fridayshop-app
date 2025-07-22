export interface IProduct {
  _id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl?: string;
  isOpen: boolean;
  isUseForm: boolean;
  formFormat?: string;
  imagesWarningUrl?: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  matchList?: string[];
}
