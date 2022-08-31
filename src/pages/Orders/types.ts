import { Order } from "../../models/Order";

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Order;
  label: string;
  numeric: boolean;
  list: boolean;
}

export type SortOrder = "asc" | "desc";
