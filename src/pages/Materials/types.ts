import { Material } from "../../models/Material";

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Material;
  label: string;
  numeric: boolean;
}

export type Order = "asc" | "desc";
