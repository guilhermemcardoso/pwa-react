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
import { listen } from "../../services/firebase/firestore/material";
import { Material } from "../../models/Material";

export default function EnhancedTable() {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Material>("name");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showCreateEditMaterialDialog, setShowCreateEditMaterialDialog] =
    useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = listen(getMaterials);

    return () => unsubscribe();
  });

  const getMaterials = (items: Material[]) => {
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
      const newSelected = materials.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleItemClick = (item: Material) => {
    const selectedIndex = selected.indexOf(item.name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, item.name);
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

  const handleOnConfirmCreateEditMaterial = () => {
    setShowCreateEditMaterialDialog(false);
  };

  const handleOnCancelCreateEditMaterial = () => {
    setShowCreateEditMaterialDialog(false);
  };

  const isSelected = useCallback(
    (name: string) => selected.indexOf(name) !== -1,
    [selected]
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper sx={{ width: "100%", p: 2 }}>
            <TableToolbar
              numSelected={selected.length}
              onAddClick={handleOnAddClick}
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
                      const isItemSelected = isSelected(row.name);

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
      <CreateEditMaterialDialog
        open={showCreateEditMaterialDialog}
        onConfirm={handleOnConfirmCreateEditMaterial}
        onCancel={handleOnCancelCreateEditMaterial}
      />
    </Container>
  );
}
