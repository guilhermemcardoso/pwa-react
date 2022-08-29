import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { Container, Typography } from "@mui/material";

interface ConfirmSignOutDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmSignOutDialog({
  open,
  onConfirm,
  onCancel,
}: ConfirmSignOutDialogProps) {
  const handleConfirm = () => {
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
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Typography component="h3" variant="h6" color="primary" gutterBottom>
          Tem certeza de que deseja sair?
        </Typography>
        <DialogActions>
          <Button color="error" variant="outlined" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button color="error" variant="contained" onClick={handleConfirm} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Container>
    </Dialog>
  );
}
