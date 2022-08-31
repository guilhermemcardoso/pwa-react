import { Unity } from "../../models/Unity";

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Unity;
  label: string;
  numeric: boolean;
}

export type Order = "asc" | "desc";
