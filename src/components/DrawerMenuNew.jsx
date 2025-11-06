import * as React from 'react';
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
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

const drawerWidth = 260;

export default function ModernDrawer({ handleAddUser, handleListUsers }) {
  const menuItems = [
    { text: 'Ekle', icon: <AddCircleOutlineIcon />, onClick: handleAddUser },
    { text: 'Sil', icon: <DeleteOutlineIcon /> },
    { text: 'Güncelle', icon: <EditOutlinedIcon /> },
    { text: 'Listele', icon: <ListAltOutlinedIcon />, onClick: handleListUsers },
  ];

  return (
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
          Kullanıcı Paneli
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />

      <Box sx={{ overflow: 'auto', px: 1 }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItemButton
              key={index}
              onClick={item.onClick}
              sx={{
                borderRadius: 2,
                mb: 1,
                px: 2,
                py: 1.2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.03)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#BDBDFD', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  letterSpacing: 0.5,
                  color: '#EAEAEA',
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          width: '100%',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 12,
        }}
      >
        <Typography variant="body2">v1.0.0</Typography>
      </Box>
    </Drawer>
  );
}
