import React, { useEffect, useState } from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../Title";
import { Material } from "../../models/Material";
import { getMaterials } from "../../services/firebase/firestore/material";
import { getUnities } from "../../services/firebase/firestore/unity";

// Generate Order Data
function createData(
  id: number,
  date: string,
  name: string,
  shipTo: string,
  paymentMethod: string,
  amount: number
) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    "16 Mar, 2019",
    "Elvis Presley",
    "Tupelo, MS",
    "VISA ⠀•••• 3719",
    312.44
  ),
  createData(
    1,
    "16 Mar, 2019",
    "Paul McCartney",
    "London, UK",
    "VISA ⠀•••• 2574",
    866.99
  ),
  createData(
    2,
    "16 Mar, 2019",
    "Tom Scholz",
    "Boston, MA",
    "MC ⠀•••• 1253",
    100.81
  ),
  createData(
    3,
    "16 Mar, 2019",
    "Michael Jackson",
    "Gary, IN",
    "AMEX ⠀•••• 2000",
    654.39
  ),
  createData(
    4,
    "15 Mar, 2019",
    "Bruce Springsteen",
    "Long Branch, NJ",
    "VISA ⠀•••• 5919",
    212.79
  ),
];

export default function UnavailableMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [mappedUnities, setMappedUnities] = useState<Map<string, string>>(
    new Map()
  );

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    const materialResponse = await getMaterials();
    const unityResponse = await getUnities();
    const newMappedUnities = new Map();
    const newMaterials: Material[] = [];

    unityResponse.forEach((unity) => {
      newMappedUnities.set(unity.id, unity.initials);
    });

    materialResponse.forEach((material) => {
      if (material.quantity <= 1) {
        newMaterials.push(material);
      }
    });

    setMaterials(newMaterials);
    setMappedUnities(newMappedUnities);
  };

  return (
    <React.Fragment>
      <Title>Materiais com estoque baixo</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Quantidade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materials.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{`${row.quantity} ${mappedUnities.get(
                row.unityId
              )}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="/main/materials" sx={{ mt: 3 }}>
        Ver materiais
      </Link>
    </React.Fragment>
  );
}
