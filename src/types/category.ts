export interface ICategory {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isOpen: boolean;
  imagesWarningUrl?: string[];
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
}
