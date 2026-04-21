import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../store/useAuthStore'
import Button from '../components/ui/Button'

export default function Login() {
  const [modo, setModo] = useState('login') // 'login' | 'registro'
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { setToken, setUsuario } = useAuthStore()
  const navigate = useNavigate()

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo)
    setError('')
    setNombre('')
    setEmail('')
    setPassword('')
    setConfirmar('')
  }

  const handleLogin = async () => {
    if (!email || !password) { setError('Completa todos los campos'); return }
    setCargando(true)
    setError('')
    try {
      const data = await authApi.login(email, password)
      setToken(data.access_token)
      navigate('/')
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  const handleRegistro = async () => {
    if (!nombre || !email || !password) { setError('Completa todos los campos'); return }
    if (password !== confirmar) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setCargando(true)
    setError('')
    try {
      const usuario = await authApi.registro(nombre, email, password)
      setUsuario(usuario)
      const data = await authApi.login(email, password)
      setToken(data.access_token)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data?.detail || 'Error al registrarse')
    } finally {
      setCargando(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #dee2e6',
    borderRadius: 8, marginBottom: 10, fontSize: 14, outline: 'none',
    transition: 'border-color 0.15s'
  }

  return (
    <div style={{
      height: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f8f9fa'
    }}>
      <div style={{
        background: 'white', padding: '2rem', borderRadius: 12,
        border: '1px solid #dee2e6', width: 360
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 32, height: 32, background: '#534AB7', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 16, fontWeight: 700
          }}>M</div>
          <span style={{ fontWeight: 600, fontSize: 16 }}>MathProf</span>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', marginBottom: 20,
          border: '1px solid #dee2e6', borderRadius: 8, overflow: 'hidden'
        }}>
          {['login', 'registro'].map(m => (
            <button
              key={m}
              onClick={() => cambiarModo(m)}
              style={{
                flex: 1, padding: '8px', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: modo === m ? 500 : 400,
                background: modo === m ? '#534AB7' : 'white',
                color: modo === m ? 'white' : '#6c757d',
                transition: 'all 0.15s'
              }}
            >
              {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            fontSize: 12, color: '#dc3545', marginBottom: 12,
            padding: '8px 12px', background: '#fff5f5',
            border: '1px solid #f5c6cb', borderRadius: 6
          }}>
            {error}
          </div>
        )}

        {/* Formulario Login */}
        {modo === 'login' && (
          <>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              style={{ ...inputStyle, marginBottom: 16 }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <Button fullWidth onClick={handleLogin} disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>
          </>
        )}

        {/* Formulario Registro */}
        {modo === 'registro' && (
          <>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Nombre completo"
              style={inputStyle}
            />
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              style={inputStyle}
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña (mín. 6 caracteres)"
              style={inputStyle}
            />
            <input
              type="password"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              placeholder="Confirmar contraseña"
              style={{ ...inputStyle, marginBottom: 16 }}
              onKeyDown={e => e.key === 'Enter' && handleRegistro()}
            />
            <Button fullWidth onClick={handleRegistro} disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </>
        )}

        <p style={{ fontSize: 12, color: '#adb5bd', textAlign: 'center', marginTop: 16 }}>
          {modo === 'login'
            ? '¿No tienes cuenta? '
            : '¿Ya tienes cuenta? '}
          <span
            onClick={() => cambiarModo(modo === 'login' ? 'registro' : 'login')}
            style={{ color: '#534AB7', cursor: 'pointer', fontWeight: 500 }}
          >
            {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </span>
        </p>
      </div>
    </div>
  )
}