import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useNavigate } from "react-router-dom";
import { SectionItemProps } from "../../..";

const OrdersItem = ({ toggleDrawer }: SectionItemProps) => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("orders");
    toggleDrawer(false);
  };

  return (
    <ListItemButton>
      <ListItemIcon>
        <BookmarkBorderIcon onClick={handleOnClick} />
      </ListItemIcon>
      <ListItemText primary="Pedidos" onClick={handleOnClick} />
    </ListItemButton>
  );
};

export default OrdersItem;
