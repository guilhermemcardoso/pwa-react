import {
  IconButton,
  InputAdornment,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { Material } from "../../../../../../models/Material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ChangeEvent } from "react";

interface TableItemProps {
  item: Material;
  currentValue?: number;
  onDeleteClick: (material: Material) => void;
  onChangeQuantity: (
    quantity: string,
    material: Material,
    index: number
  ) => void;
  suffix: string;
  index: number;
}

export default function TableItem({
  currentValue,
  item,
  index,
  suffix,
  onDeleteClick,
  onChangeQuantity,
}: TableItemProps) {
  const handleOnClick = () => {
    onDeleteClick(item);
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    onChangeQuantity(value, item, index);
  };

  return (
    <TableRow key={item.id}>
      <TableCell align="left">{item.name}</TableCell>
      <TableCell align="right">
        <Box sx={{ display: "flex", flexDirection: "row", textAlign: "right", justifyContent: "space-between" }}>
          <TextField
            sx={{ maxWidth: 100 }}
            onChange={handleOnChange}
            defaultValue={currentValue || ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{suffix}</InputAdornment>
              ),
            }}
          />
          <IconButton onClick={handleOnClick}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}
