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
import { Order, OrderProduct } from "../../../../models/Order";
import { Material } from "../../../../models/Material";
import {
  addOrder,
  updateOrder,
} from "../../../../services/firebase/firestore/order";
import { v4 as uuid } from "uuid";
import TableItem from "./components/TableItem";
import { Product } from "../../../../models/Product";

interface CreateEditOrderDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  selectedItem?: Order;
  materials: Material[];
  products: Product[];
}

export default function CreateEditOrderDialog({
  open,
  selectedItem,
  materials,
  products,
  onConfirm,
  onCancel,
}: CreateEditOrderDialogProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [mappedProducts, setMappedProducts] = useState<Map<string, number>>(
    new Map()
  );

  useEffect(() => {
    if (selectedItem) {
      const newMappedProducts = new Map();
      const newSelectedProducts: Product[] = [];
      selectedItem.products.forEach((productItem: OrderProduct) => {
        const product = products.find(
          (item) => item.id === productItem.productId
        );

        if (product) {
          newMappedProducts.set(product.id, productItem.quantity);
          newSelectedProducts.push(product);
        }
      });

      setSelectedProducts(newSelectedProducts);
      setMappedProducts(newMappedProducts);
    }
  }, [selectedItem, products]);

  const title = useMemo(
    () => (selectedItem ? "Editar Pedido" : "Novo Pedido"),
    [selectedItem]
  );

  const handleSelectedProductChange = (event: SelectChangeEvent) => {
    const newProduct = products.find((item) => item.id === event.target.value);

    const newSelectedProducts = [...selectedProducts];
    const newMappedProducts = new Map(mappedProducts);
    if (newProduct) {
      const alreadyExists = newSelectedProducts.find(
        (item) => item.id === newProduct.id
      );
      if (alreadyExists) {
        return;
      }
      newSelectedProducts.push(newProduct);
      newMappedProducts.set(newProduct.id, 0);
    }
    setSelectedProducts(newSelectedProducts);
    setMappedProducts(newMappedProducts);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const customerName = (
      event.currentTarget.elements.namedItem("customerName") as HTMLInputElement
    ).value;

    const discount = (
      event.currentTarget.elements.namedItem("discount") as HTMLInputElement
    ).value;

    const orderDescription = (
      event.currentTarget.elements.namedItem(
        "orderDescription"
      ) as HTMLInputElement
    ).value;

    const productList: OrderProduct[] = [];
    let total = 0;
    mappedProducts?.forEach((value, key) => {
      const productItem = selectedProducts.find((item) => item.id === key);
      if (productItem) {
        total = total + productItem.price * value;
      }
      const product: OrderProduct = { productId: key, quantity: value };
      productList.push(product);
    });

    const order: Order = {
      id: selectedItem ? selectedItem.id : uuid(),
      customerName: customerName,
      description: orderDescription,
      discount: Number(discount),
      total: total,
      products: productList,
      createdAt: selectedItem
        ? selectedItem.createdAt
        : new Date().toDateString(),
    };

    let response = undefined;
    if (selectedItem) {
      response = await updateOrder(order);
    } else {
      response = await addOrder(order);
    }

    if (!response) {
      setErrorMessage(
        "Não foi possível realizar esta ação no momento. Tente mais tarde."
      );
      return;
    }

    setErrorMessage("");
    setSelectedProducts([]);
    setMappedProducts(new Map());
    onConfirm();
  };

  const handleCancel = () => {
    setSelectedProducts([]);
    setMappedProducts(new Map());
    onCancel();
  };

  const handleOnDeleteProduct = (product: Product) => {
    const newSelectedProducts = selectedProducts.filter(
      (item) => item.id !== product.id
    );
    const newMappedProducts = new Map(mappedProducts);
    newMappedProducts.delete(product.id);

    setSelectedProducts(newSelectedProducts);
    setMappedProducts(newMappedProducts);
  };

  const handleOnChangeProductQuantity = (
    value: string,
    product: Product,
    index: number
  ) => {
    const newMappedProducts = new Map(mappedProducts);

    newMappedProducts.set(product.id, Number(value) || 0);
    setMappedProducts(newMappedProducts);
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
                  name="customerName"
                  required
                  fullWidth
                  id="customerName"
                  label="Nome do Cliente"
                  autoFocus
                  defaultValue={selectedItem?.customerName || ""}
                  error={errorMessage.length > 0}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="discount"
                  label="Desconto (R$)"
                  name="description"
                  defaultValue={selectedItem?.discount || ""}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="orderDescription"
                  label="Descrição do Pedido"
                  name="price"
                  defaultValue={selectedItem?.description || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="unity-label">Adicionar Produtos</InputLabel>
                <Select
                  labelId="unity-label"
                  id="products"
                  fullWidth
                  label="Produtos"
                  onChange={handleSelectedProductChange}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
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
                      <TableCell>Produto</TableCell>
                      <TableCell>Quantidade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProducts.map((row, index) => {
                      const currentValue = mappedProducts.get(row.id);
                      return (
                        <TableItem
                          key={row.id}
                          item={row}
                          index={index}
                          currentValue={currentValue}
                          onDeleteClick={handleOnDeleteProduct}
                          onChangeQuantity={handleOnChangeProductQuantity}
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
