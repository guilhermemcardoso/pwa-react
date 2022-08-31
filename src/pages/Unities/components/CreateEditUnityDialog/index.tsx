import React, { FormEvent, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Unity } from "../../../../models/Unity";
import {
  addUnity,
  updateUnity,
} from "../../../../services/firebase/firestore/unity";
import { v4 as uuid } from "uuid";

interface CreateEditUnityDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  selectedItem?: Unity;
}

export default function CreateEditUnityDialog({
  open,
  selectedItem,
  onConfirm,
  onCancel,
}: CreateEditUnityDialogProps) {
  const [errorMessage, setErrorMessage] = useState("");

  const title = useMemo(
    () => (selectedItem ? "Editar Unid. Medida" : "Nova Unid. Medida"),
    [selectedItem]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const unityName = (
      event.currentTarget.elements.namedItem("unityName") as HTMLInputElement
    ).value;

    const initials = (
      event.currentTarget.elements.namedItem("initials") as HTMLInputElement
    ).value;

    const unity: Unity = {
      id: selectedItem ? selectedItem.id : uuid(),
      name: unityName,
      initials: initials,
      createdAt: selectedItem
        ? selectedItem.createdAt
        : new Date().toDateString(),
    };

    let response = undefined;
    if (selectedItem) {
      response = await updateUnity(unity);
    } else {
      response = await addUnity(unity);
    }

    if (!response) {
      setErrorMessage(
        "Não foi possível realizar esta ação no momento. Tente mais tarde."
      );
      return;
    }

    setErrorMessage("");
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Container maxWidth="md" sx={{ p: 2 }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  name="unityName"
                  required
                  fullWidth
                  id="unityName"
                  label="Nome da Unidade de Medida"
                  autoFocus
                  defaultValue={selectedItem?.name || ""}
                  error={errorMessage.length > 0}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="initials"
                  label="Sigla"
                  name="initials"
                  defaultValue={selectedItem?.initials || ""}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="error" align="center">
                  {errorMessage}
                </Typography>
              </Box>
            </Grid>
            <DialogActions>
              <Button
                onClick={handleCancel}
                variant="outlined"
                color="error"
                sx={{ mt: 3, mb: 2 }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{ mt: 3, mb: 2 }}
              >
                {selectedItem ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Container>
    </Dialog>
  );
}
