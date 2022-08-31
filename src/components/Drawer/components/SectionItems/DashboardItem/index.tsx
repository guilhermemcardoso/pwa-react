import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate } from "react-router-dom";
import { SectionItemProps } from "../../..";

const DashboardItem = ({ toggleDrawer }: SectionItemProps) => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("dashboard");
    toggleDrawer(false);
  };

  return (
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon onClick={handleOnClick} />
      </ListItemIcon>
      <ListItemText primary="Painel Geral" onClick={handleOnClick} />
    </ListItemButton>
  );
};

export default DashboardItem;
