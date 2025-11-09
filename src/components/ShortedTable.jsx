import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TableSortLabel, Paper, TextField, Box, Typography
} from "@mui/material";

// Örnek veri
const initialProducts = [
  { id: 1, name: "Kalem", price: 10, stock: 50 },
  { id: 2, name: "Defter", price: 25, stock: 100 },
  { id: 3, name: "Silgi", price: 5, stock: 200 },
  { id: 4, name: "Çanta", price: 150, stock: 30 },
];

function ProductTable() {
  const [orderDirection, setOrderDirection] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Sıralama kontrolü
  const handleSort = (property) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // 🔹 Arama filtresi
  const filteredProducts = initialProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Sıralama işlemi
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return orderDirection === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return orderDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Ürün Listesi
      </Typography>

      {/* 🔸 Arama Kutusu */}
      <TextField
        label="Ürün Ara"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 🔸 Tablo */}
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
            {sortedProducts.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell align="right">{p.price} ₺</TableCell>
                <TableCell align="right">{p.stock}</TableCell>
              </TableRow>
            ))}
            {sortedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Sonuç bulunamadı
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
