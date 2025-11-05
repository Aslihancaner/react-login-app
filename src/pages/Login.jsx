import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Container, Box, TextField, Button, Typography } from '@mui/material'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post('http://localhost:8000/login', { username, password })
      const token = res.data.access_token
      localStorage.setItem('token', token)
      navigate('/app')
    } catch (err) {
      setError(err.response?.data?.detail || 'Giriş başarısız')
    }
  }

  return (
    <Container maxWidth='xs'>
      <Box sx={{ mt: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant='h5' align='center'>Giriş Yap</Typography>
        <TextField label='Kullanıcı Adı' value={username} onChange={(e)=>setUsername(e.target.value)} />
        <TextField label='Şifre' type='password' value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <Typography color='error'>{error}</Typography>}
        <Button variant='contained' onClick={handleSubmit}>Giriş</Button>
      </Box>
    </Container>
  )
}
