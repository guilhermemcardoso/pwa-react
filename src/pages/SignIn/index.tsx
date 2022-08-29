import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Footer from "../../components/Footer";

import "./style.css";
import { VALID_EMAIL_REGEX } from "../../constants/regex";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn, user, authLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const validateFields = (email: string, password: string): boolean => {
    const isEmailValid = !!email.toLowerCase().match(VALID_EMAIL_REGEX);
    const isPasswordValid = password.length >= 6;

    return isEmailValid && isPasswordValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = (
      event.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const password = (
      event.currentTarget.elements.namedItem("password") as HTMLInputElement
    ).value;

    if (!validateFields(email, password)) {
      setErrorMessage("Email e/ou senha inválidos");
      return;
    }

    setErrorMessage("");
    const signInResponse = await signIn(email, password);
    if (signInResponse) {
      navigate("/dashboard");
    }

    setErrorMessage("Email e/ou senha incorretos");
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          className="logo"
          src={require("../../assets/dashboard_logo.png")}
          alt="Dashboard Logo"
        />
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            error={errorMessage.length > 0}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            error={errorMessage.length > 0}
          />
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="error" align="center">
              {errorMessage}
            </Typography>
          </Box>
          <LoadingButton
            loading={authLoading}
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </LoadingButton>
          <Link href="#" variant="body2">
            Esqueceu a senha?
          </Link>
        </Box>
      </Box>
      <Footer sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
