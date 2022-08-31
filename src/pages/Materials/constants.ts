import { HeadCell } from "./types";

export const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Nome",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: true,
    label: "Descrição",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: true,
    label: "Quantidade",
  },
  {
    id: "unityId",
    numeric: false,
    disablePadding: true,
    label: "Unid. Medida",
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: true,
    label: "Data Criação",
  },
];
