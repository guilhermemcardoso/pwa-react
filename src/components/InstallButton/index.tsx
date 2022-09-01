import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { BeforeInstallPromptEvent } from "../../types/InstallPrompt";

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = (evt: any) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall?.prompt();
  };
  if (!supportsPWA) {
    return null;
  }
  return (
    <Grid
      item
      xs={12}
      sm={12}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        m: 4,
      }}
    >
      <Button
        className="link-button"
        id="setup_button"
        aria-label="Install app"
        title="Install app"
        variant="outlined"
        onClick={onClick}
      >
        Install App
      </Button>
    </Grid>
  );
};

export default InstallPWA;
