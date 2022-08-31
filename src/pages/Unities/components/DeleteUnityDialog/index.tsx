import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { Box, Container, CssBaseline, Grid, Typography } from "@mui/material";
import { Unity } from "../../../../models/Unity";
import { deleteUnity } from "../../../../services/firebase/firestore/unity";

interface DeleteUnityDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  selectedItems: Unity[];
}

export default function DeleteUnityDialog({
  open,
  selectedItems,
  onConfirm,
  onCancel,
}: DeleteUnityDialogProps) {
  const [errorMessage, setErrorMessage] = useState("");

  const title = useMemo(() => {
    const count = selectedItems.length;
    return count > 1
      ? `Deseja realmente excluir todos os ${count} itens selecionados?`
      : "Deseja excluir o item selecionado?";
  }, [selectedItems]);

  const handleSubmit = async () => {
    const response = await deleteUnity(selectedItems);
    if (!response) {
      setErrorMessage(
        "Não foi possível excluir os itens selecionados. Tente novamente mais tarde"
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
          <Box sx={{ mt: 3 }}>
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
                onClick={handleSubmit}
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
