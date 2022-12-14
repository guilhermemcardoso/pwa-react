import React, { useMemo } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { Product } from "../../../../models/Product";
import { Unity } from "../../../../models/Unity";
import { Material } from "../../../../models/Material";

interface TableItemProps {
  item: Product;
  onSelect: (item: Product) => void;
  selected: boolean;
  unities: Unity[];
  materials: Material[];
}

export default function TableItem({
  item,
  onSelect,
  selected,
  materials,
  unities,
}: TableItemProps) {
  const handleClick = (event: React.MouseEvent<unknown>) => {
    onSelect(item);
  };

  const materialCol = useMemo(() => {
    let result = "";
    item.materials.map((item) => {
      const material = materials.find((n) => n.id === item.materialId);
      if (material) {
        const unity = unities.find((k) => k.id === material.unityId);
        if (unity) {
          result += ` ${material.name} (${item.quantity} ${unity.initials})`;
        }
      }
    });
    return result;
  }, [item.materials, materials, unities]);

  return (
    <TableRow
      hover
      onClick={handleClick}
      role="checkbox"
      aria-checked={selected}
      tabIndex={-1}
      key={item.id}
      selected={selected}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={selected}
          inputProps={{
            "aria-labelledby": item.name,
          }}
        />
      </TableCell>
      <TableCell component="th" id={item.name} scope="row" padding="none">
        {item.name}
      </TableCell>
      <TableCell align="left">{item.description}</TableCell>
      <TableCell align="left">{item.price}</TableCell>
      <TableCell align="left">{materialCol}</TableCell>
      <TableCell align="left">{item.createdAt}</TableCell>
    </TableRow>
  );
}
