import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { MainItems, SecondaryItems } from "./components/Sections";

interface DrawerProps {
  open: boolean;
  toggleDrawer: (open?: boolean) => void;
}

export interface SectionProps {
  toggleDrawer: (open?: boolean) => void;
}

export interface SectionItemProps {
  toggleDrawer: (open?: boolean) => void;
}

const drawerWidth: number = 240;
const { innerWidth: width } = window;

const DrawerComponent = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(open && {
      [theme.breakpoints.down("sm")]: {
        width: width,
      },
    }),
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(7),
      },
    }),
  },
}));

function Drawer({ open, toggleDrawer }: DrawerProps) {
  const handleToggleDrawer = () => {
    toggleDrawer(false);
  };
  return (
    <DrawerComponent variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          px: [1],
        }}
      >
        <IconButton onClick={handleToggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <MainItems toggleDrawer={toggleDrawer} />
        <Divider sx={{ my: 1 }} />
        <SecondaryItems toggleDrawer={toggleDrawer} />
      </List>
    </DrawerComponent>
  );
}

export default Drawer;
