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
import CreateEditMaterialDialog from "./components/CreateEditMaterialDialog";
import { Material } from "../../models/Material";
import { getMaterials } from "../../services/firebase/firestore/material";
import DeleteMaterialDialog from "./components/DeleteMaterialDialog";
import { getUnities } from "../../services/firebase/firestore/unity";
import { Unity } from "../../models/Unity";

export default function Materials() {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Material>("name");
  const [selected, setSelected] = useState<Material[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [unities, setUnities] = useState<Unity[]>([]);
  const [showCreateEditMaterialDialog, setShowCreateEditMaterialDialog] =
    useState<boolean>(false);
  const [showDeleteMaterialDialog, setShowDeleteMaterialDialog] =
    useState<boolean>(false);

  useEffect(() => {
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

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Material
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = materials.map((n) => n);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleItemClick = (item: Material) => {
    const selectedIndex = selected.findIndex((n) => n.id === item.id);
    let newSelected: Material[] = [];

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
    setShowCreateEditMaterialDialog(true);
  };

  const handleOnDeleteClick = () => {
    setShowDeleteMaterialDialog(true);
  };

  const handleOnUpdateClick = () => {
    setShowCreateEditMaterialDialog(true);
  };

  const handleOnConfirmCreateEditMaterial = async () => {
    setSelected([]);
    setShowCreateEditMaterialDialog(false);
    await loadMaterials();
  };

  const handleOnCancelCreateEditMaterial = () => {
    setShowCreateEditMaterialDialog(false);
  };

  const handleOnConfirmDeleteMaterial = async () => {
    setSelected([]);
    setShowDeleteMaterialDialog(false);
    await loadMaterials();
  };

  const handleOnCancelDeleteMaterial = () => {
    setShowDeleteMaterialDialog(false);
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
                  rowCount={materials.length}
                />
                <TableBody>
                  {materials
                    .sort(getComparator(order, orderBy))
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const unity = unities.find(
                        (item) => row.unityId === item.id
                      );
                      return (
                        <TableItem
                          key={row.id}
                          onSelect={handleItemClick}
                          item={row}
                          unity={unity}
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
      <CreateEditMaterialDialog
        open={showCreateEditMaterialDialog}
        unities={unities}
        selectedItem={selected.length === 1 ? selected[0] : undefined}
        onConfirm={handleOnConfirmCreateEditMaterial}
        onCancel={handleOnCancelCreateEditMaterial}
      />
      <DeleteMaterialDialog
        open={showDeleteMaterialDialog}
        selectedItems={selected}
        onConfirm={handleOnConfirmDeleteMaterial}
        onCancel={handleOnCancelDeleteMaterial}
      />
    </Container>
  );
}
