import { Product } from "./Product";

export interface Order {
  id: string;
  description: string;
  products: Product[];
  discount: number;
  total: number;
  customerName: string;
  createdAt: string;
}
