import * as React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { Material } from "../../../../models/Material";
import { Unity } from "../../../../models/Unity";

interface TableItemProps {
  item: Material;
  onSelect: (item: Material) => void;
  selected: boolean;
  unity?: Unity;
}

export default function TableItem({
  item,
  onSelect,
  selected,
  unity,
}: TableItemProps) {
  const handleClick = (event: React.MouseEvent<unknown>) => {
    onSelect(item);
  };

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
      <TableCell align="left">{item.quantity}</TableCell>
      <TableCell align="left">
        {unity ? `${unity.name} (${unity.initials})` : ""}
      </TableCell>
      <TableCell align="left">{item.createdAt}</TableCell>
    </TableRow>
  );
}
