import React from 'react'
import { Drawer, Toolbar, List, ListItemButton, ListItemText, Box } from '@mui/material'

const drawerWidth = 240

export default function DrawerMenu(){
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItemButton>
            <ListItemText primary="Ekle" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Sil" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Güncelle" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Listele" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  )
}
