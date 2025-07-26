export interface IExpense {
  _id: string;
  date: string;
  item: string;
  amount: number;
  category: string;
  payment_method: string;
  account: string;
  vendor: string;
  note?: string;
  document?: string;
  slip_image?: string;
  reference?: string;
  fee?: number;
  createdAt: string;
  updatedAt: string;
}
