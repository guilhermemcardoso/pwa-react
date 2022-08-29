import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ConfirmSignOutDialog from "./components/ConfirmSignOutDialog";
import { useState } from "react";
import { useAuth } from "../../../../../contexts/authContext";
import { useNavigate } from "react-router-dom";

const SignOutItem = () => {
  const [showConfirmSignOutDialog, setShowConfirmSignOutDialog] =
    useState(false);

  const navigate = useNavigate();
  const { signOut } = useAuth();
  const handleOnClick = () => {
    setShowConfirmSignOutDialog(true);
  };

  const handleConfirmSignOut = async () => {
    setShowConfirmSignOutDialog(false);
    const response = await signOut();
    if (response) {
      navigate("/", { replace: true });
    }
  };

  const handleCancelSignOut = () => {
    setShowConfirmSignOutDialog(false);
  };

  return (
    <ListItemButton>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText primary="Sair" onClick={handleOnClick} />
      <ConfirmSignOutDialog
        open={showConfirmSignOutDialog}
        onConfirm={handleConfirmSignOut}
        onCancel={handleCancelSignOut}
      />
    </ListItemButton>
  );
};

export default SignOutItem;
