export interface ILineCustomer {
  _id: string;
  userId: string;
  name: string;
  point: number;
  isBan?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
