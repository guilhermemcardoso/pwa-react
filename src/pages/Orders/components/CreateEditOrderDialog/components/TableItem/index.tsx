import {
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import { ChangeEvent } from "react";
import { Product } from "../../../../../../models/Product";

interface TableItemProps {
  item: Product;
  currentValue?: number;
  onDeleteClick: (material: Product) => void;
  onChangeQuantity: (quantity: string, product: Product, index: number) => void;
  index: number;
}

export default function TableItem({
  currentValue,
  item,
  index,
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            textAlign: "right",
            justifyContent: "space-between",
          }}
        >
          <TextField
            sx={{ maxWidth: 100 }}
            onChange={handleOnChange}
            defaultValue={currentValue || ""}
          />
          <IconButton onClick={handleOnClick}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}
