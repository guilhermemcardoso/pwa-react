import * as React from "react";
import { SectionProps } from "../..";
import {
  DashboardItem,
  MaterialsItem,
  OrdersItem,
  ProductsItem,
  UnitiesItem,
} from "../SectionItems";

const MainItems = ({ toggleDrawer }: SectionProps) => {
  return (
    <React.Fragment>
      <DashboardItem toggleDrawer={toggleDrawer} />
      <OrdersItem toggleDrawer={toggleDrawer} />
      <ProductsItem toggleDrawer={toggleDrawer} />
      <MaterialsItem toggleDrawer={toggleDrawer} />
      <UnitiesItem toggleDrawer={toggleDrawer} />
    </React.Fragment>
  );
};

export default MainItems;
