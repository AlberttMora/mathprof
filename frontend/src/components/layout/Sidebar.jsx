import { Link, useLocation } from 'react-router-dom'
import { useRef } from 'react'
import { useDocumentos } from '../../hooks/useDocumentos'
import SectionLabel from '../ui/SectionLabel'

export default function Sidebar() {
  const location = useLocation()
  const { documentos, subiendo, subirDocumento } = useDocumentos(1)
  const inputRef = useRef(null)

  const handleArchivo = (e) => {
    const archivo = e.target.files[0]
    if (archivo) subirDocumento(archivo)
  }

  const navItems = [
    { path: '/', label: '📐 Pizarra' },
    { path: '/historial', label: '📁 Historial' },
  ]

  return (
    <div style={{
      borderRight: '1px solid #dee2e6', background: '#f8f9fa',
      overflowY: 'auto', padding: '1rem',
      display: 'flex', flexDirection: 'column', gap: '1.5rem'
    }}>
      <div>
        <SectionLabel>navegación</SectionLabel>
        {navItems.map(({ path, label }) => (
          <Link key={path} to={path} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px', borderRadius: 8, fontSize: 13,
            color: location.pathname === path ? '#534AB7' : '#495057',
            background: location.pathname === path ? '#EEEDFE' : 'transparent',
            fontWeight: location.pathname === path ? 500 : 400,
            textDecoration: 'none', marginBottom: 2
          }}>
            {label}
          </Link>
        ))}
      </div>

      <div>
        <SectionLabel>material del profesor</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {documentos.length === 0 && (
            <p style={{ fontSize: 12, color: '#adb5bd' }}>Sin documentos aún</p>
          )}
          {documentos.map(doc => (
            <div key={doc.id} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 8px', border: '1px solid #dee2e6',
              borderRadius: 6, fontSize: 12, color: '#495057', background: 'white'
            }}>
              <span style={{ color: '#639922', fontSize: 8 }}>●</span>
              {doc.nombre}
            </div>
          ))}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={handleArchivo}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={subiendo}
          style={{
            marginTop: 8, width: '100%', padding: '5px',
            border: '1px dashed #ced4da', borderRadius: 6,
            fontSize: 12, color: '#6c757d', background: 'transparent',
            cursor: 'pointer'
          }}
        >
          {subiendo ? 'subiendo...' : '+ subir PDF'}
        </button>
      </div>
    </div>
  )
}