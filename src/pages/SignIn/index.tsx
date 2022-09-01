import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Footer from "../../components/Footer";

import "./style.css";
import { VALID_EMAIL_REGEX } from "../../constants/regex";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn, user, authLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateFields = (email: string, password: string): boolean => {
    const isEmailValid = !!email.toLowerCase().match(VALID_EMAIL_REGEX);
    const isPasswordValid = password.length >= 6;

    return isEmailValid && isPasswordValid;
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    if (!validateFields(email, password)) {
      setErrorMessage("Email e/ou senha inválidos");
      return;
    }

    setErrorMessage("");
    const signInResponse = await signIn(email, password);
    if (signInResponse) {
      navigate("/main/dashboard");
    }

    setErrorMessage("Email e/ou senha incorretos");
  };

  useEffect(() => {
    if (user) {
      navigate("/main/dashboard");
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
        <Box sx={{ mt: 1 }}>
          <FormControl sx={{ mt: 2 }} fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email"
              type={"text"}
              value={email}
              fullWidth
              onChange={handleEmailChange}
              label="Email"
            />
          </FormControl>
          <FormControl sx={{ mt: 2 }} fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Senha"
            />
          </FormControl>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="error" align="center">
              {errorMessage}
            </Typography>
          </Box>
          <LoadingButton
            loading={authLoading}
            onClick={handleSubmit}
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
