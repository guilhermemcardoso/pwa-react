import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Title from "../Title";
import { Order } from "../../models/Order";
import { formatCurrency } from "../../utils/number";
import { isToday } from "../../utils/date";
import { Box } from "@mui/material";

interface DepositsProps {
  data: Order[];
}

export default function Deposits({ data }: DepositsProps) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let newTotal = 0;
    data.forEach((order) => {
      if (isToday(new Date(order.createdAt))) {
        newTotal += order.total;
      }
    });
    setTotal(newTotal);
  }, [data]);

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Title>Pedidos Recentes</Title>
        <Typography variant="h4">{formatCurrency(total)}</Typography>
        <Typography color="text.secondary">
          {new Date().toDateString()}
        </Typography>
      </Box>
    </React.Fragment>
  );
}
