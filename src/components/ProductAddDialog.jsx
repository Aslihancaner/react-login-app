import React, { useState } from 'react';
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

const drawerWidth = 260;

export default function ProductDrawerWithDialog() {
  // Dialog state
  const [openAdd, setOpenAdd] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    stock: '',
    size: '',
    sizeUnit: '',
    category: '',
  });

  const categories = ['Elektronik', 'Giyim', 'Ev & Yaşam', 'Gıda', 'Kırtasiye'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    setOpenAdd(true);
  };

  const handleClose = () => {
    setOpenAdd(false);
  };
const handleSave = async () => {
  const productData = {
    productName,
    description,
    price,
    stock,
    size,
    sizeUnit,
    category,
  };

  try {
    const response = await axios.post("http://localhost:8000/products", productData);
    console.log("Ürün eklendi:", response.data);
    alert("Ürün başarıyla eklendi!");
    onClose();
  } catch (error) {
    console.error("Ürün eklenirken hata oluştu:", error);
    alert("Ürün eklenemedi!");
  }
};
  const handleSubmitAdd = async () => {
    try {
      // TODO: backend'e gönder
      // await axios.post("http://localhost:8080/api/products", formData);
      console.log('Ürün eklendi:', formData);
      handleClose();
    } catch (err) {
      console.error('Ürün ekleme hatası:', err);
    }
  };

  return (
    <>
      {/* === Sol Drawer === */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1E1E2F 0%, #2E2E42 100%)',
            color: '#fff',
            borderRight: 'none',
            boxShadow: '4px 0 10px rgba(0,0,0,0.3)',
          },
        }}
      >
        <Toolbar sx={{ justifyContent: 'center', mt: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              color: '#E0E0E0',
              textTransform: 'uppercase',
            }}
          >
            Ürün Paneli
          </Typography>
        </Toolbar>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />

        <Box sx={{ overflow: 'auto', px: 1 }}>
          <List>
            <ListItemButton onClick={handleAddProduct}>
              <ListItemIcon sx={{ color: '#BDBDFD' }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Ekle" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon sx={{ color: '#BDBDFD' }}>
                <EditOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Güncelle" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon sx={{ color: '#BDBDFD' }}>
                <DeleteOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Sil" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon sx={{ color: '#BDBDFD' }}>
                <ListAltOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Listele" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Ürün Ekle Popup */}
      <Dialog open={openAdd} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Ürün Ekle</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            margin="normal"
            label="Ürün Adı"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Açıklama"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Fiyat"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Stok"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Boyut"
              name="size"
              type="number"
              value={formData.size}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Birim (örnek: kg, cm, L)"
              name="sizeUnit"
              value={formData.sizeUnit}
              onChange={handleInputChange}
            />
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Kategori</InputLabel>
            <Select
              name="category"
              value={formData.category}
              label="Kategori"
              onChange={handleInputChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleSubmitAdd} variant="contained" color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
