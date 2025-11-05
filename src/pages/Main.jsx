import React from 'react'
import { Box, Toolbar, AppBar, Typography } from '@mui/material'
import DrawerMenu from '../components/DrawerMenu'

export default function Main(){
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant='h6'>Ana Ekran</Typography>
        </Toolbar>
      </AppBar>
      <DrawerMenu />
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography>Hoşgeldiniz — buraya içerik gelecek.</Typography>
      </Box>
    </Box>
  )
}
