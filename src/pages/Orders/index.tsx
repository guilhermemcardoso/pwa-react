import React, { useCallback, useState, MouseEvent, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { Container, Grid } from "@mui/material";
import { SortOrder } from "./types";
import { getComparator } from "./utils";
import { TableHead, TableItem, TableToolbar } from "./components";
import Footer from "../../components/Footer";
import { Order } from "../../models/Order";
import { getOrders } from "../../services/firebase/firestore/order";
import { getProducts } from "../../services/firebase/firestore/product";
import { getMaterials } from "../../services/firebase/firestore/material";
import { Material } from "../../models/Material";
import { Product } from "../../models/Product";
import CreateEditOrderDialog from "./components/CreateEditOrderDialog";
import DeleteOrderDialog from "./components/DeleteOrderDialog";

export default function Orders() {
  const [order, setOrder] = useState<SortOrder>("asc");
  const [orderBy, setOrderBy] = useState<keyof Order>("customerName");
  const [selected, setSelected] = useState<Order[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showCreateEditOrderDialog, setShowCreateEditOrderDialog] =
    useState<boolean>(false);
  const [showDeleteOrderDialog, setShowDeleteOrderDialog] =
    useState<boolean>(false);

  useEffect(() => {
    loadOrders();
    loadMaterials();
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const items = await getProducts();
    setProducts(items);
  };

  const loadMaterials = async () => {
    const items = await getMaterials();
    setMaterials(items);
  };

  const loadOrders = async () => {
    const items = await getOrders();
    setOrders(items);
  };

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Order
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = orders.map((n) => n);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleItemClick = (item: Order) => {
    const selectedIndex = selected.findIndex((n) => n.id === item.id);
    let newSelected: Order[] = [];

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
    setShowCreateEditOrderDialog(true);
  };

  const handleOnDeleteClick = () => {
    setShowDeleteOrderDialog(true);
  };

  const handleOnUpdateClick = () => {
    setShowCreateEditOrderDialog(true);
  };

  const handleOnConfirmCreateEditOrder = async () => {
    setSelected([]);
    setShowCreateEditOrderDialog(false);
    await loadOrders();
  };

  const handleOnCancelCreateEditOrder = () => {
    setSelected([]);
    setShowCreateEditOrderDialog(false);
  };

  const handleOnConfirmDeleteOrder = async () => {
    setSelected([]);
    setShowDeleteOrderDialog(false);
    await loadOrders();
  };

  const handleOnCancelDeleteOrder = () => {
    setShowDeleteOrderDialog(false);
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
                  rowCount={orders.length}
                />
                <TableBody>
                  {orders
                    .sort(getComparator(order, orderBy))
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      return (
                        <TableItem
                          key={row.id}
                          onSelect={handleItemClick}
                          item={row}
                          products={products}
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
      <CreateEditOrderDialog
        open={showCreateEditOrderDialog}
        products={products}
        materials={materials}
        selectedItem={selected.length === 1 ? selected[0] : undefined}
        onConfirm={handleOnConfirmCreateEditOrder}
        onCancel={handleOnCancelCreateEditOrder}
      />
      <DeleteOrderDialog
        open={showDeleteOrderDialog}
        selectedItems={selected}
        onConfirm={handleOnConfirmDeleteOrder}
        onCancel={handleOnCancelDeleteOrder}
      />
    </Container>
  );
}
