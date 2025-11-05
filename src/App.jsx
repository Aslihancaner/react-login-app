import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Main from './pages/Main'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/app' element={
        <ProtectedRoute>
          <Main />
        </ProtectedRoute>
      } />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}
