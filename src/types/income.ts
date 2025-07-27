export interface IIncome {
  _id: string;
  date: Date;
  item: string;
  income: number;
  cost: number;
  profit: number;
  note?: string;
  sales_channel?: string;
  sales_type?: string;
  bank?: string;
  supplier?: string;
  slip_image?: string;
  customer?: string;
  reference?: string;
  fee?: number;
  createdAt: Date;
  updatedAt: Date;
}
