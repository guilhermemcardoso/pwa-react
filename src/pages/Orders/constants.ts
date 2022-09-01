import { HeadCell } from "./types";

export const headCells: readonly HeadCell[] = [
  {
    id: "customerName",
    numeric: false,
    disablePadding: true,
    label: "Nome",
    list: false,
  },
  {
    id: "description",
    numeric: false,
    disablePadding: true,
    label: "Descrição",
    list: false,
  },
  {
    id: "products",
    numeric: false,
    disablePadding: true,
    label: "Produtos",
    list: true,
  },
  {
    id: "discount",
    numeric: true,
    disablePadding: true,
    label: "Desconto (R$)",
    list: false,
  },
  {
    id: "subtotal",
    numeric: true,
    disablePadding: true,
    label: "Subtotal (R$)",
    list: false,
  },
  {
    id: "total",
    numeric: true,
    disablePadding: true,
    label: "Total (R$)",
    list: false,
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: true,
    label: "Data Criação",
    list: false,
  },
];
