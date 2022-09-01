import React, { useMemo } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { Product } from "../../../../models/Product";
import { Order } from "../../../../models/Order";

interface TableItemProps {
  item: Order;
  onSelect: (item: Order) => void;
  selected: boolean;
  products: Product[];
}

export default function TableItem({
  item,
  onSelect,
  selected,
  products,
}: TableItemProps) {
  const handleClick = (event: React.MouseEvent<unknown>) => {
    onSelect(item);
  };

  const productCol = useMemo(() => {
    let result = "";
    item.products.forEach((item) => {
      const product = products.find((n) => n.id === item.productId);
      if (product) {
        result += ` ${product.name} (${item.quantity})`;
      }
    });
    return result;
  }, [item.products, products]);

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
            "aria-labelledby": item.customerName,
          }}
        />
      </TableCell>
      <TableCell
        component="th"
        id={item.customerName}
        scope="row"
        padding="none"
      >
        {item.customerName}
      </TableCell>
      <TableCell align="left">{item.description}</TableCell>
      <TableCell align="left">{productCol}</TableCell>
      <TableCell align="left">{item.discount}</TableCell>
      <TableCell align="left">{item.subtotal}</TableCell>
      <TableCell align="left">{item.total}</TableCell>
      <TableCell align="left">{item.createdAt}</TableCell>
    </TableRow>
  );
}
