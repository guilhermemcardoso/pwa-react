import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { Unity } from "../../../../models/Unity";

interface TableToolbarProps {
  selectedItems: Unity[];
  onAddClick: () => void;
  onDeleteClick: () => void;
  onUpdateClick: () => void;
}

const TableToolbar = ({
  selectedItems,
  onAddClick,
  onDeleteClick,
  onUpdateClick,
}: TableToolbarProps) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selectedItems.length > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {selectedItems.length > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selectedItems.length} selecionado(s)
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Unidades de Medida
        </Typography>
      )}
      {selectedItems.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Tooltip title="Remover">
            <IconButton onClick={onDeleteClick}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {selectedItems.length === 1 && (
            <Tooltip title="Editar">
              <IconButton onClick={onUpdateClick}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ) : (
        <Tooltip title="Adicionar unidade de medida">
          <Button variant="contained" onClick={onAddClick}>
            <AddIcon />
          </Button>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default TableToolbar;
