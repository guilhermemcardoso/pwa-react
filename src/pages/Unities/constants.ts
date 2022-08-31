import { HeadCell } from "./types";

export const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Nome",
  },
  {
    id: "initials",
    numeric: false,
    disablePadding: true,
    label: "Sigla",
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: true,
    label: "Data Criação",
  },
];
