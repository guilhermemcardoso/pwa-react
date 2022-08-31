import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { Box, Container, CssBaseline, Grid, Typography } from "@mui/material";
import { Order } from "../../../../models/Order";
import { deleteOrder } from "../../../../services/firebase/firestore/order";

interface DeleteOrderDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  selectedItems: Order[];
}

export default function DeleteOrderDialog({
  open,
  selectedItems,
  onConfirm,
  onCancel,
}: DeleteOrderDialogProps) {
  const [errorMessage, setErrorMessage] = useState("");

  const title = useMemo(() => {
    const count = selectedItems.length;
    return count > 1
      ? `Deseja realmente excluir todos os ${count} itens selecionados?`
      : "Deseja excluir o item selecionado?";
  }, [selectedItems]);

  const handleSubmit = async () => {
    const response = await deleteOrder(selectedItems);
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
                Confirmar
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Container>
    </Dialog>
  );
}
