import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../store/useAuthStore'
import Button from '../components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { setToken } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) return
    setCargando(true)
    setError('')
    try {
      const data = await authApi.login(email, password)
      setToken(data.access_token)
      navigate('/')
    } catch {
      setError('Credenciales incorrectas')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{
      height: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f8f9fa'
    }}>
      <div style={{
        background: 'white', padding: '2rem', borderRadius: 12,
        border: '1px solid #dee2e6', width: 340
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 28, height: 28, background: '#534AB7', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 14, fontWeight: 700
          }}>M</div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>MathProf</span>
        </div>
        <p style={{ fontSize: 13, color: '#6c757d', marginBottom: 20 }}>
          Inicia sesión para continuar
        </p>

        {error && (
          <p style={{ fontSize: 12, color: '#dc3545', marginBottom: 10 }}>{error}</p>
        )}

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          style={{
            width: '100%', padding: '8px 12px', border: '1px solid #dee2e6',
            borderRadius: 8, marginBottom: 10, fontSize: 14, outline: 'none'
          }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          style={{
            width: '100%', padding: '8px 12px', border: '1px solid #dee2e6',
            borderRadius: 8, marginBottom: 16, fontSize: 14, outline: 'none'
          }}
        />
        <Button fullWidth onClick={handleLogin} disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </Button>
      </div>
    </div>
  )
}