import React, { FormEvent, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import {
  Box,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Material } from "../../../../models/Material";
import {
  addMaterial,
  updateMaterial,
} from "../../../../services/firebase/firestore/material";
import { v4 as uuid } from "uuid";

interface CreateEditMaterialDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  selectedItem?: Material;
}

export default function CreateEditMaterialDialog({
  open,
  selectedItem,
  onConfirm,
  onCancel,
}: CreateEditMaterialDialogProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedUnity, setSelectedUnity] = useState("");

  const title = useMemo(
    () => (selectedItem ? "Editar Material" : "Novo Material"),
    [selectedItem]
  );

  const handleSelectedUnityChange = (event: SelectChangeEvent) => {
    console.log("selected item", event.target.value);
    setSelectedUnity(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const materialName = (
      event.currentTarget.elements.namedItem("materialName") as HTMLInputElement
    ).value;
    const materialDescription = (
      event.currentTarget.elements.namedItem(
        "materialDescription"
      ) as HTMLInputElement
    ).value;
    const quantity = (
      event.currentTarget.elements.namedItem("quantity") as HTMLInputElement
    ).value;

    const material: Material = {
      id: selectedItem ? selectedItem.id : uuid(),
      name: materialName,
      description: materialDescription,
      quantity: Number(quantity),
      unityId: selectedUnity,
      createdAt: selectedItem
        ? selectedItem.createdAt
        : new Date().toDateString(),
    };

    if (selectedItem) {
      await updateMaterial(material);
    } else {
      await addMaterial(material);
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
              <Grid item xs={12} sm={6}>
                <TextField
                  name="materialName"
                  required
                  fullWidth
                  id="materialName"
                  label="Nome do Material"
                  autoFocus
                  error={errorMessage.length > 0}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="quantity"
                  label="Quantidade"
                  name="quantity"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="unity-label">Unidade de Medida</InputLabel>
                  <Select
                    labelId="unity-label"
                    id="unity"
                    value={selectedUnity}
                    label="Unidade de Medida"
                    onChange={handleSelectedUnityChange}
                  >
                    <MenuItem value={10}>Metros (mt)</MenuItem>
                    <MenuItem value={20}>Centímetros (cm)</MenuItem>
                    <MenuItem value={30}>Kilos (kg)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="materialDescription"
                  label="Descrição do Material"
                  name="materialDescription"
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
                Adicionar
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Container>
    </Dialog>
  );
}
