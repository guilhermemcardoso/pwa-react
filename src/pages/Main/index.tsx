import { useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "../../components/Drawer";
import AppBar from "../../components/AppBar";
import AuthenticatedRouter from "../../navigation/authenticatedRouter";
import { useLocation } from "react-router-dom";
import { getPageTitleByRoute } from "./utils";

function Main() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const location = useLocation();
  console.log("location", location.pathname);
  const appBarTitle = useMemo(
    () => getPageTitleByRoute(location.pathname),
    [location.pathname]
  );

  const toggleDrawer = (open?: boolean) => {
    const isOpened = open === undefined ? !drawerOpen : open;
    setDrawerOpen(isOpened);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar open={drawerOpen} title={appBarTitle} toggleDrawer={toggleDrawer} />
      <Drawer open={drawerOpen} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <AuthenticatedRouter />
      </Box>
    </Box>
  );
}

export default Main;
