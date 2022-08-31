import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DashboardItem from "../SectionItems/DashboardItem";
import MaterialsItem from "../SectionItems/MaterialsItem";
import { SectionProps } from "../..";
import UnitiesItem from "../SectionItems/UnitiesItem";

const MainItems = ({ toggleDrawer }: SectionProps) => {
  return (
    <React.Fragment>
      <DashboardItem toggleDrawer={toggleDrawer} />
      <ListItemButton>
        <ListItemIcon>
          <ColorLensIcon />
        </ListItemIcon>
        <ListItemText primary="Produtos" />
      </ListItemButton>
      <MaterialsItem toggleDrawer={toggleDrawer} />
      <UnitiesItem toggleDrawer={toggleDrawer} />
      <ListItemButton>
        <ListItemIcon>
          <AddShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Produção" />
      </ListItemButton>
    </React.Fragment>
  );
};

export default MainItems;
