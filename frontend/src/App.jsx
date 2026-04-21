import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Pizarra from './pages/Pizarra'
import Historial from './pages/Historial'
import Login from './pages/Login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pizarra />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}