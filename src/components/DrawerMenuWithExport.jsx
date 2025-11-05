import React, { useState } from 'react'
import {
  Drawer, Toolbar, List, ListItemButton, ListItemText,
  Box, Typography, Table, TableHead, TableBody, TableCell, TableRow,
  Button, Stack
} from '@mui/material'
import axios from 'axios'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const drawerWidth = 240

export default function DrawerMenu() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const baseUrl = 'http://localhost:8080/api/users'

  const handleListUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get(baseUrl)
      setUsers(res.data)
      setMessage('Kullanıcı listesi başarıyla yüklendi.')
    } catch (err) {
      console.error(err)
      setMessage('Kullanıcılar yüklenirken hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    try {
      setLoading(true)
      const newUser = {
        username: 'testuser_' + Math.floor(Math.random() * 1000),
        email: 'test@example.com',
        password: '1234'
      }
      const res = await axios.post(baseUrl, newUser)
      setMessage(`Yeni kullanıcı eklendi: ${res.data.username || 'unknown'}`)
      await handleListUsers()
    } catch (err) {
      console.error(err)
      setMessage('Kullanıcı eklenirken hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 EXCEL export
  const exportToExcel = () => {
    if (users.length === 0) return
    const worksheet = XLSX.utils.json_to_sheet(users)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kullanıcılar')
    XLSX.writeFile(workbook, 'kullanici_listesi.xlsx')
  }

  // 🔹 PDF export
  const exportToPDF = () => {
    if (users.length === 0) return
    const doc = new jsPDF()
    doc.text('Kullanıcı Listesi', 14, 15)
    const tableData = users.map(u => [u.id, u.username, u.email])
    doc.autoTable({
      head: [['ID', 'Kullanıcı Adı', 'Email']],
      body: tableData,
      startY: 20,
    })
    doc.save('kullanici_listesi.pdf')
  }

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* Sol Drawer */}
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
            <ListItemButton onClick={handleAddUser}>
              <ListItemText primary="Ekle" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Sil" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Güncelle" />
            </ListItemButton>
            <ListItemButton onClick={handleListUsers}>
              <ListItemText primary="Listele" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Sağ içerik alanı */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h6" gutterBottom>Java Backend Kullanıcı İşlemleri</Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="outlined" onClick={exportToExcel} disabled={users.length === 0}>
            Excel'e Aktar
          </Button>
          <Button variant="outlined" onClick={exportToPDF} disabled={users.length === 0}>
            PDF'e Aktar
          </Button>
        </Stack>

        {loading && <Typography>Yükleniyor...</Typography>}
        {message && <Typography sx={{ mb: 2 }}>{message}</Typography>}

        {users.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Kullanıcı Adı</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {users.length === 0 && !loading && (
          <Typography>Kullanıcı listesi boş.</Typography>
        )}
      </Box>
    </Box>
  )
}
//npm install xlsx jspdf jspdf-autotable
//const worksheet = XLSX.utils.json_to_sheet(users, { header: ['id', 'username', 'email'] })
