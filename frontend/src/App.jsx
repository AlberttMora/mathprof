import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import Pizarra from './pages/Pizarra'
import Historial from './pages/Historial'
import Login from './pages/Login'

function RutaProtegida({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RutaProtegida><Pizarra /></RutaProtegida>} />
        <Route path="/historial" element={<RutaProtegida><Historial /></RutaProtegida>} />
      </Routes>
    </BrowserRouter>
  )
}