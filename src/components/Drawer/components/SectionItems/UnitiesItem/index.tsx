import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import { SectionItemProps } from "../../..";

const UnitiesItem = ({ toggleDrawer }: SectionItemProps) => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("unities");
    toggleDrawer(false);
  };

  return (
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon onClick={handleOnClick} />
      </ListItemIcon>
      <ListItemText primary="Unid. Medida" onClick={handleOnClick} />
    </ListItemButton>
  );
};

export default UnitiesItem;
