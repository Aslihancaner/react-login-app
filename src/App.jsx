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

/**
 * import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductListPage from "./pages/ProductListPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/app" element={<ProductListPage />} />
    </Routes>
  );
}

export default App;

 */

/**
 * 
 * import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProductListPage from "./pages/ProductListPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<ProductListPage />} />
      </Route>
    </Routes>
  );
}

export default App;

 */