import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { useNavigate } from "react-router-dom";
import { SectionItemProps } from "../../..";

const ProductsItem = ({ toggleDrawer }: SectionItemProps) => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("products");
    toggleDrawer(false);
  };

  return (
    <ListItemButton>
      <ListItemIcon>
        <ColorLensIcon onClick={handleOnClick} />
      </ListItemIcon>
      <ListItemText primary="Produtos" onClick={handleOnClick} />
    </ListItemButton>
  );
};

export default ProductsItem;
