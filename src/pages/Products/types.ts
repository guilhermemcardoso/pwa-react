import { Product } from "../../models/Product";

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Product;
  label: string;
  numeric: boolean;
  list: boolean;
}

export type Order = "asc" | "desc";
