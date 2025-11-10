import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TableSortLabel, Paper, TextField, Box, Typography
} from "@mui/material";

function isNumberLike(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === "string" && v.trim() === "") return false;
  const n = Number(v);
  return Number.isFinite(n);
}

function compareValues(a, b, orderDirection = "asc") {
  const aU = a === null || a === undefined ? null : a;
  const bU = b === null || b === undefined ? null : b;

  if (aU === null && bU === null) return 0;
  if (aU === null) return 1;
  if (bU === null) return -1;

  const aIsNum = isNumberLike(aU);
  const bIsNum = isNumberLike(bU);

  if (aIsNum && bIsNum) {
    const an = Number(aU);
    const bn = Number(bU);
    if (an < bn) return orderDirection === "asc" ? -1 : 1;
    if (an > bn) return orderDirection === "asc" ? 1 : -1;
    return 0;
  }

  const astr = String(aU);
  const bstr = String(bU);
  const cmp = astr.localeCompare(bstr, "tr", { sensitivity: "base", numeric: true });
  return orderDirection === "asc" ? cmp : -cmp;
}

function ProductTable({ products }) {
  const [orderDirection, setOrderDirection] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (property) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const safeProducts = Array.isArray(products) ? products : [];

  const filtered = safeProducts.filter((p) =>
    p.name?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aval = a[orderBy];
    const bval = b[orderBy];
    return compareValues(aval, bval, orderDirection);
  });

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Ürün Listesi
      </Typography>

      <TextField
        label="Ürün Ara"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? orderDirection : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Ürün Adı
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "price"}
                  direction={orderBy === "price" ? orderDirection : "asc"}
                  onClick={() => handleSort("price")}
                >
                  Fiyat
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "stock"}
                  direction={orderBy === "stock" ? orderDirection : "asc"}
                  onClick={() => handleSort("stock")}
                >
                  Stok
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.length > 0 ? (
              sorted.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell align="right">{p.price ?? "-"}</TableCell>
                  <TableCell align="right">{p.stock ?? "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  {products ? "Sonuç bulunamadı" : "Yükleniyor..."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ProductTable;
