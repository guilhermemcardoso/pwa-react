import React, { FormEvent, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import {
  Box,
  Container,
  CssBaseline,
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
import { Unity } from "../../../../models/Unity";

interface CreateEditMaterialDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  selectedItem?: Material;
  unities: Unity[];
}

export default function CreateEditMaterialDialog({
  open,
  selectedItem,
  unities,
  onConfirm,
  onCancel,
}: CreateEditMaterialDialogProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedUnity, setSelectedUnity] = useState<Unity>();

  const title = useMemo(
    () => (selectedItem ? "Editar Material" : "Novo Material"),
    [selectedItem]
  );

  const handleSelectedUnityChange = (event: SelectChangeEvent) => {
    const unity = unities.find((item) => item.id === event.target.value);
    setSelectedUnity(unity);
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
      unityId: selectedUnity?.id || "",
      createdAt: selectedItem
        ? selectedItem.createdAt
        : new Date().toDateString(),
    };

    let response = undefined;
    if (selectedItem) {
      response = await updateMaterial(material);
    } else {
      response = await addMaterial(material);
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
              <Grid item xs={12} sm={6}>
                <TextField
                  name="materialName"
                  required
                  fullWidth
                  id="materialName"
                  label="Nome do Material"
                  autoFocus
                  defaultValue={selectedItem?.name || ""}
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
                  defaultValue={selectedItem?.quantity || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="unity-label">Unidade de Medida</InputLabel>
                <Select
                  labelId="unity-label"
                  id="unity"
                  fullWidth
                  value={selectedUnity?.id}
                  defaultValue={selectedItem?.unityId}
                  label="Unidade de Medida"
                  onChange={handleSelectedUnityChange}
                >
                  {unities.map((unity) => (
                    <MenuItem
                      key={unity.id}
                      value={unity.id}
                    >{`${unity.name} (${unity.initials})`}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="materialDescription"
                  label="Descrição do Material"
                  name="materialDescription"
                  defaultValue={selectedItem?.description || ""}
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
