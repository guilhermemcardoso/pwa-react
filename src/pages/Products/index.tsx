import React, { useCallback, useState, MouseEvent, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { Container, Grid } from "@mui/material";
import { Order } from "./types";
import { getComparator } from "./utils";
import { TableHead, TableItem, TableToolbar } from "./components";
import Footer from "../../components/Footer";
import CreateEditProductDialog from "./components/CreateEditProductDialog";
import { Product } from "../../models/Product";
import { getProducts } from "../../services/firebase/firestore/product";
import DeleteProductDialog from "./components/DeleteProductDialog";
import { getUnities } from "../../services/firebase/firestore/unity";
import { Unity } from "../../models/Unity";
import { getMaterials } from "../../services/firebase/firestore/material";
import { Material } from "../../models/Material";

export default function Products() {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Product>("name");
  const [selected, setSelected] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [unities, setUnities] = useState<Unity[]>([]);
  const [showCreateEditProductDialog, setShowCreateEditProductDialog] =
    useState<boolean>(false);
  const [showDeleteProductDialog, setShowDeleteProductDialog] =
    useState<boolean>(false);

  useEffect(() => {
    loadProducts();
    loadMaterials();
    loadUnities();
  }, []);

  const loadUnities = async () => {
    const items = await getUnities();
    setUnities(items);
  };

  const loadMaterials = async () => {
    const items = await getMaterials();
    setMaterials(items);
  };

  const loadProducts = async () => {
    const items = await getProducts();
    setProducts(items);
  };

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Product
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = products.map((n) => n);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleItemClick = (item: Product) => {
    const selectedIndex = selected.findIndex((n) => n.id === item.id);
    let newSelected: Product[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, item);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleOnAddClick = () => {
    setShowCreateEditProductDialog(true);
  };

  const handleOnDeleteClick = () => {
    setShowDeleteProductDialog(true);
  };

  const handleOnUpdateClick = () => {
    setShowCreateEditProductDialog(true);
  };

  const handleOnConfirmCreateEditProduct = async () => {
    setSelected([]);
    setShowCreateEditProductDialog(false);
    await loadProducts();
  };

  const handleOnCancelCreateEditProduct = () => {
    setSelected([]);
    setShowCreateEditProductDialog(false);
  };

  const handleOnConfirmDeleteProduct = async () => {
    setSelected([]);
    setShowDeleteProductDialog(false);
    await loadProducts();
  };

  const handleOnCancelDeleteProduct = () => {
    setShowDeleteProductDialog(false);
  };

  const isSelected = useCallback(
    (id: string) => selected.findIndex((item) => item.id === id) !== -1,
    [selected]
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper sx={{ width: "100%", p: 2 }}>
            <TableToolbar
              selectedItems={selected}
              onAddClick={handleOnAddClick}
              onDeleteClick={handleOnDeleteClick}
              onUpdateClick={handleOnUpdateClick}
            />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={"medium"}
              >
                <TableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={products.length}
                />
                <TableBody>
                  {products
                    .sort(getComparator(order, orderBy))
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      return (
                        <TableItem
                          key={row.id}
                          onSelect={handleItemClick}
                          item={row}
                          unities={unities}
                          materials={materials}
                          selected={isItemSelected}
                        />
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <Footer />
      <CreateEditProductDialog
        open={showCreateEditProductDialog}
        unities={unities}
        materials={materials}
        selectedItem={selected.length === 1 ? selected[0] : undefined}
        onConfirm={handleOnConfirmCreateEditProduct}
        onCancel={handleOnCancelCreateEditProduct}
      />
      <DeleteProductDialog
        open={showDeleteProductDialog}
        selectedItems={selected}
        onConfirm={handleOnConfirmDeleteProduct}
        onCancel={handleOnCancelDeleteProduct}
      />
    </Container>
  );
}
