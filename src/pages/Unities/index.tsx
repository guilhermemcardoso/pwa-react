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
import CreateEditUnityDialog from "./components/CreateEditUnityDialog";
import { getUnities } from "../../services/firebase/firestore/unity";
import { Unity } from "../../models/Unity";
import DeleteUnityDialog from "./components/DeleteUnityDialog";

export default function EnhancedTable() {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Unity>("name");
  const [selected, setSelected] = useState<Unity[]>([]);
  const [unities, setUnitys] = useState<Unity[]>([]);
  const [showCreateEditUnityDialog, setShowCreateEditUnityDialog] =
    useState<boolean>(false);
  const [showDeleteUnityDialog, setShowDeleteUnityDialog] =
    useState<boolean>(false);

  useEffect(() => {
    loadUnities();
  }, []);

  const loadUnities = async () => {
    const items = await getUnities();
    setUnitys(items);
  };

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Unity
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = unities.map((n) => n);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleItemClick = (item: Unity) => {
    const selectedIndex = selected.findIndex((n) => n.id === item.id);
    let newSelected: Unity[] = [];

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
    setShowCreateEditUnityDialog(true);
  };

  const handleOnDeleteClick = () => {
    setShowDeleteUnityDialog(true);
  };

  const handleOnUpdateClick = () => {
    setShowCreateEditUnityDialog(true);
  };

  const handleOnConfirmCreateEditUnity = async () => {
    setSelected([]);
    setShowCreateEditUnityDialog(false);
    await loadUnities();
  };

  const handleOnCancelCreateEditUnity = () => {
    setShowCreateEditUnityDialog(false);
  };

  const handleOnConfirmDeleteUnity = async () => {
    setSelected([]);
    setShowDeleteUnityDialog(false);
    await loadUnities();
  };

  const handleOnCancelDeleteUnity = () => {
    setShowDeleteUnityDialog(false);
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
                  rowCount={unities.length}
                />
                <TableBody>
                  {unities
                    .sort(getComparator(order, orderBy))
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);

                      return (
                        <TableItem
                          key={row.id}
                          onSelect={handleItemClick}
                          item={row}
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
      <CreateEditUnityDialog
        open={showCreateEditUnityDialog}
        selectedItem={selected.length === 1 ? selected[0] : undefined}
        onConfirm={handleOnConfirmCreateEditUnity}
        onCancel={handleOnCancelCreateEditUnity}
      />
      <DeleteUnityDialog
        open={showDeleteUnityDialog}
        selectedItems={selected}
        onConfirm={handleOnConfirmDeleteUnity}
        onCancel={handleOnCancelDeleteUnity}
      />
    </Container>
  );
}
