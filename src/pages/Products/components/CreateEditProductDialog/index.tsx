import { FormEvent, useEffect, useMemo, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Product, ProductMaterial } from "../../../../models/Product";
import { Material } from "../../../../models/Material";
import {
  addProduct,
  updateProduct,
} from "../../../../services/firebase/firestore/product";
import { v4 as uuid } from "uuid";
import TableItem from "./components/TableItem";
import { Unity } from "../../../../models/Unity";

interface CreateEditProductDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  selectedItem?: Product;
  materials: Material[];
  unities: Unity[];
}

export default function CreateEditProductDialog({
  open,
  selectedItem,
  materials,
  unities,
  onConfirm,
  onCancel,
}: CreateEditProductDialogProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [mappedMaterials, setMappedMaterials] = useState<Map<string, number>>(
    new Map()
  );

  useEffect(() => {
    if (selectedItem) {
      const newMappedMaterials = new Map();
      const newSelectedMaterials: Material[] = [];
      selectedItem.materials.forEach((materialItem: ProductMaterial) => {
        const material = materials.find(
          (item) => item.id === materialItem.materialId
        );

        if (material) {
          newMappedMaterials.set(material.id, materialItem.quantity);
          newSelectedMaterials.push(material);
        }
      });

      setSelectedMaterials(newSelectedMaterials);
      setMappedMaterials(newMappedMaterials);
    }
  }, [selectedItem, materials]);

  const title = useMemo(
    () => (selectedItem ? "Editar Produto" : "Novo Produto"),
    [selectedItem]
  );

  const handleSelectedMaterialChange = (event: SelectChangeEvent) => {
    const newMaterial = materials.find(
      (item) => item.id === event.target.value
    );

    const newSelectedMaterials = [...selectedMaterials];
    const newMappedMaterials = new Map(mappedMaterials);
    if (newMaterial) {
      const alreadyExists = newSelectedMaterials.find(
        (item) => item.id === newMaterial.id
      );
      if (alreadyExists) {
        return;
      }
      newSelectedMaterials.push(newMaterial);
      newMappedMaterials.set(newMaterial.id, 0);
    }
    setSelectedMaterials(newSelectedMaterials);
    setMappedMaterials(newMappedMaterials);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const productName = (
      event.currentTarget.elements.namedItem("productName") as HTMLInputElement
    ).value;
    const productDescription = (
      event.currentTarget.elements.namedItem(
        "productDescription"
      ) as HTMLInputElement
    ).value;
    const price = (
      event.currentTarget.elements.namedItem("price") as HTMLInputElement
    ).value;

    const materialList: ProductMaterial[] = [];
    mappedMaterials?.forEach((value, key) => {
      const material: ProductMaterial = { materialId: key, quantity: value };
      materialList.push(material);
    });

    const product: Product = {
      id: selectedItem ? selectedItem.id : uuid(),
      name: productName,
      description: productDescription,
      price: Number(price),
      materials: materialList,
      createdAt: selectedItem
        ? selectedItem.createdAt
        : new Date().toDateString(),
    };

    let response = undefined;
    if (selectedItem) {
      response = await updateProduct(product);
    } else {
      response = await addProduct(product);
    }

    if (!response) {
      setErrorMessage(
        "Não foi possível realizar esta ação no momento. Tente mais tarde."
      );
      return;
    }

    setErrorMessage("");
    setSelectedMaterials([]);
    setMappedMaterials(new Map());
    onConfirm();
  };

  const handleCancel = () => {
    setSelectedMaterials([]);
    setMappedMaterials(new Map());
    onCancel();
  };

  const handleOnDeleteMaterial = (material: Material) => {
    const newSelectedMaterials = selectedMaterials.filter(
      (item) => item.id !== material.id
    );
    const newMappedMaterials = new Map(mappedMaterials);
    newMappedMaterials.delete(material.id);

    setSelectedMaterials(newSelectedMaterials);
    setMappedMaterials(newMappedMaterials);
  };

  const handleOnChangeMaterialQuantity = (
    value: string,
    material: Material,
    index: number
  ) => {
    const newMappedMaterials = new Map(mappedMaterials);

    newMappedMaterials.set(material.id, Number(value) || 0);
    setMappedMaterials(newMappedMaterials);
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
                  name="productName"
                  required
                  fullWidth
                  id="productName"
                  label="Nome do Produto"
                  autoFocus
                  defaultValue={selectedItem?.name || ""}
                  error={errorMessage.length > 0}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="price"
                  label="Preço do Produto"
                  name="price"
                  defaultValue={selectedItem?.price || ""}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="productDescription"
                  label="Descrição do Produto"
                  name="description"
                  defaultValue={selectedItem?.description || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="unity-label">Adicionar Materiais</InputLabel>
                <Select
                  labelId="unity-label"
                  id="materials"
                  fullWidth
                  label="Materiais"
                  onChange={handleSelectedMaterialChange}
                >
                  {materials.map((material) => (
                    <MenuItem key={material.id} value={material.id}>
                      {material.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table aria-labelledby="tableTitle" size={"medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Material</TableCell>
                      <TableCell>Quantidade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedMaterials.map((row, index) => {
                      const unity = unities.find(
                        (item) => item.id === row.unityId
                      );
                      const suffix = unity ? unity.initials : "";
                      const currentValue = mappedMaterials.get(row.id);
                      return (
                        <TableItem
                          key={row.id}
                          item={row}
                          index={index}
                          currentValue={currentValue}
                          onDeleteClick={handleOnDeleteMaterial}
                          onChangeQuantity={handleOnChangeMaterialQuantity}
                          suffix={suffix}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
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
