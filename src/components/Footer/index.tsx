import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

function Footer(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 2 }}
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.denguices.com.br/">
        D.
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default Footer;
