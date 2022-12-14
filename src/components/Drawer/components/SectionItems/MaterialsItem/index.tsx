import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExtensionIcon from '@mui/icons-material/Extension';
import { useNavigate } from "react-router-dom";
import { SectionItemProps } from "../../..";

const MaterialsItem = ({ toggleDrawer }: SectionItemProps) => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("materials");
    toggleDrawer(false);
  };

  return (
    <ListItemButton>
      <ListItemIcon>
        <ExtensionIcon onClick={handleOnClick} />
      </ListItemIcon>
      <ListItemText primary="Materiais" onClick={handleOnClick} />
    </ListItemButton>
  );
};

export default MaterialsItem;
