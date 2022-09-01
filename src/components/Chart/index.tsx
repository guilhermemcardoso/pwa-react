import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "../Title";
import { getOrders } from "../../services/firebase/firestore/order";
import { isToday } from "../../utils/date";
import { Order } from "../../models/Order";

interface Data {
  time: string;
  amount: number;
}

interface ChartProps {
  data: Order[];
}

export default function Chart({ data }: ChartProps) {
  const theme = useTheme();
  const [chartData, setChartData] = useState<Data[]>([]);

  useEffect(() => {
    loadData();
  }, [data]);

  const loadData = () => {
    const todayOrders: Data[] = [];
    data.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (isToday(orderDate)) {
        const newData: Data = {
          time: order.createdAt,
          amount: order.total,
        };
        todayOrders.push(newData);
      }
    });
    setChartData(todayOrders);
  };

  return (
    <React.Fragment>
      <Title>Hoje</Title>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
