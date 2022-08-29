import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";

const theme = createTheme({
  palette: {
    primary: {
      main: palette.dark_brown,
    },
    secondary: {
      main: palette.light_pink,
    },
  },
});

export default theme;
