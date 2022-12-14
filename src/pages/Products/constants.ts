import { HeadCell } from "./types";

export const headCells: readonly HeadCell[] = [
  {
    id: "name",
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
    id: "price",
    numeric: true,
    disablePadding: true,
    label: "Preço",
    list: false,
  },
  {
    id: "materials",
    numeric: false,
    disablePadding: true,
    label: "Materiais",
    list: true,
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: true,
    label: "Data Criação",
    list: false,
  },
];
