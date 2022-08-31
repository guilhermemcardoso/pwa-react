import { ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import Router from "./navigation/mainRouter";
import theme from "./theme";
import { initFirebase } from "./services/firebase";

function App() {
  useEffect(() => {
    initFirebase();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
