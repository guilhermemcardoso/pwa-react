import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import {
  Box,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
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
import { LoadingButton } from "@mui/lab";
import { updateMaterialAvailability } from "../../../../services/firebase/firestore/material";
import { formatCurrency } from "../../../../utils/number";

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
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [canFinish, setCanFinish] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [mappedProducts, setMappedProducts] = useState<Map<string, number>>(
    new Map()
  );
  const [mappedMaterials, setMappedMaterials] = useState<Map<string, number>>(
    new Map()
  );

  // useEffect(() => {
  //   if (selectedItem) {
  //     const newMappedProducts = new Map();
  //     const newSelectedProducts: Product[] = [];
  //     selectedItem.products.forEach((productItem: OrderProduct) => {
  //       const product = products.find(
  //         (item) => item.id === productItem.productId
  //       );

  //       if (product) {
  //         newMappedProducts.set(product.id, productItem.quantity);
  //         newSelectedProducts.push(product);
  //       }
  //     });

  //     setSelectedProducts(newSelectedProducts);
  //     setMappedProducts(newMappedProducts);
  //   }
  // }, [selectedItem, products]);

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

  const handleOnChangeDiscount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    try {
      setDiscount(Number(value));
    } catch (error) {
      setDiscount(0);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const customerName = (
        event.currentTarget.elements.namedItem(
          "customerName"
        ) as HTMLInputElement
      ).value;

      const orderDescription = (
        event.currentTarget.elements.namedItem(
          "orderDescription"
        ) as HTMLInputElement
      ).value;

      const productList: OrderProduct[] = [];

      mappedProducts?.forEach((value, key) => {
        const product: OrderProduct = { productId: key, quantity: value };
        productList.push(product);
      });

      const order: Order = {
        id: selectedItem ? selectedItem.id : uuid(),
        customerName: customerName,
        description: orderDescription,
        discount: Number(discount),
        subtotal: subtotal,
        total: subtotal - Number(discount),
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
        const usedMaterials = new Map();
        order.products.forEach((productId) => {
          const product = products.find(
            (item) => item.id === productId.productId
          );
          if (product) {
            product.materials.forEach((materialId) => {
              const materialExists = usedMaterials.get(materialId.materialId);
              if (materialExists) {
                usedMaterials.set(
                  materialId.materialId,
                  materialExists + materialId.quantity * productId.quantity
                );
              } else {
                usedMaterials.set(
                  materialId.materialId,
                  materialId.quantity * productId.quantity
                );
              }
            });
          }
        });
        usedMaterials.forEach((value, key) => {
          const material = materials.find((item) => item.id === key);
          if (material) {
            updateMaterialAvailability(material.id, material.quantity - value);
          }
        });
      }

      if (!response) {
        setErrorMessage(
          "Não foi possível realizar esta ação no momento. Tente mais tarde."
        );
        setLoading(false);
        return;
      }

      setErrorMessage("");
      setSelectedProducts([]);
      setMappedProducts(new Map());
      setLoading(false);
      onConfirm();
    } catch (error) {
      setErrorMessage(
        "Não foi possível realizar esta ação no momento. Tente mais tarde."
      );
      setLoading(false);
      return;
    }
  };

  const handleCancel = () => {
    setSelectedProducts([]);
    setMappedProducts(new Map());
    setSubtotal(0);
    setDiscount(0);
    setErrorMessage("");
    onCancel();
  };

  const handleOnDeleteProduct = (product: Product) => {
    const newSelectedProducts = selectedProducts.filter(
      (item) => item.id !== product.id
    );
    const newMappedProducts = new Map(mappedProducts);
    const newMappedMaterials = new Map();
    let message = "";

    newMappedProducts.delete(product.id);

    let newSubtotal = 0;
    newMappedProducts?.forEach((value, key) => {
      const productItem = newSelectedProducts.find((item) => item.id === key);
      if (productItem) {
        newSubtotal = newSubtotal + productItem.price * value;
      }

      const product = products.find((item) => item.id === key);
      if (!product) {
        return;
      }

      product.materials.forEach((materialItem) => {
        const material = materials.find(
          (item) => item.id === materialItem.materialId
        );
        if (!material) {
          return;
        }

        const alreadyExists = newMappedMaterials.get(material.id);
        const newMaterialQuantity = alreadyExists
          ? alreadyExists + value * materialItem.quantity
          : value * materialItem.quantity;
        newMappedMaterials.set(material.id, newMaterialQuantity);
        if (newMaterialQuantity > material.quantity) {
          setCanFinish(false);
          if (message.length === 0) {
            message = `Quantidade de materiais insuficiente para produzir os itens selecionados. (${material.name}`;
          } else {
            message += `, ${material.name}`;
          }
        }
      });
    });

    if (message.length > 0) {
      message += ")";
    }

    setErrorMessage(message);
    setSubtotal(newSubtotal);
    setSelectedProducts(newSelectedProducts);
    setMappedProducts(newMappedProducts);
  };

  const handleOnChangeProductQuantity = (
    value: string,
    product: Product,
    index: number
  ) => {
    const newMappedProducts = new Map(mappedProducts);
    const newMappedMaterials = new Map();
    setCanFinish(true);
    setErrorMessage("");

    let message = "";
    newMappedProducts.set(product.id, Number(value) || 0);

    let newSubtotal = 0;
    newMappedProducts?.forEach((value, key) => {
      const productItem = selectedProducts.find((item) => item.id === key);
      if (productItem) {
        newSubtotal = newSubtotal + productItem.price * value;
      }
    });

    newMappedProducts.forEach((productValue, productKey) => {
      const product = products.find((item) => item.id === productKey);
      if (!product) {
        return;
      }

      product.materials.forEach((materialItem) => {
        const material = materials.find(
          (item) => item.id === materialItem.materialId
        );
        if (!material) {
          return;
        }

        const alreadyExists = newMappedMaterials.get(material.id);
        const newMaterialQuantity = alreadyExists
          ? alreadyExists + productValue * materialItem.quantity
          : productValue * materialItem.quantity;
        newMappedMaterials.set(material.id, newMaterialQuantity);
        if (newMaterialQuantity > material.quantity) {
          setCanFinish(false);
          if (message.length === 0) {
            message = `Quantidade de materiais insuficiente para produzir os itens selecionados. (${material.name}`;
          } else {
            message += `, ${material.name}`;
          }
        }
      });
    });

    if (message.length > 0) {
      message += ")";
    }

    setErrorMessage(message);
    setSubtotal(newSubtotal);
    setMappedMaterials(newMappedMaterials);
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-discount">
                    Desconto
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-discount"
                    fullWidth
                    name="discount"
                    onChange={handleOnChangeDiscount}
                    defaultValue={selectedItem ? selectedItem.discount : ""}
                    value={discount}
                    startAdornment={
                      <InputAdornment position="start">
                        <Typography>R$</Typography>
                      </InputAdornment>
                    }
                    label="Desconto"
                  />
                </FormControl>
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
                  value=""
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
            {selectedProducts.length > 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" align="center">
                    Subtotal:
                  </Typography>
                  <Typography variant="body1" align="center">
                    {formatCurrency(subtotal)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" align="center">
                    Desconto:
                  </Typography>
                  <Typography variant="body1" align="center">
                    {`- ${formatCurrency(discount)}`}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" align="center">
                    Total:
                  </Typography>
                  <Typography variant="body1" align="center">
                    {`${formatCurrency(subtotal - discount)}`}
                  </Typography>
                </Box>
              </Grid>
            )}
            <DialogActions>
              <Button
                onClick={handleCancel}
                variant="outlined"
                color="error"
                sx={{ mt: 3, mb: 2 }}
              >
                Cancelar
              </Button>
              <LoadingButton
                disabled={!canFinish || selectedProducts.length === 0}
                loading={loading}
                type="submit"
                variant="contained"
                color="success"
                sx={{ mt: 3, mb: 2 }}
              >
                {selectedItem ? "Atualizar" : "Adicionar"}
              </LoadingButton>
            </DialogActions>
          </Box>
        </Box>
      </Container>
    </Dialog>
  );
}
