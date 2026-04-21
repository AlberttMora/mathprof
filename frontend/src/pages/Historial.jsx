import { useEffect, useState } from 'react'
import { analisisApi } from '../api/analisisApi'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import SectionLabel from '../components/ui/SectionLabel'

export default function Historial() {
  const [ejercicios, setEjercicios] = useState([])
  const [temaSeleccionado, setTemaSeleccionado] = useState(null)
  const [editandoId, setEditandoId] = useState(null)
  const [nuevoTema, setNuevoTema] = useState('')

  useEffect(() => {
    analisisApi.obtenerHistorial(1).then(setEjercicios).catch(() => setEjercicios([]))
  }, [])

  const temas = [...new Set(ejercicios.map(e => e.tema_personalizado || e.tema || 'Sin tema'))]

  const ejerciciosFiltrados = temaSeleccionado
    ? ejercicios.filter(e => (e.tema_personalizado || e.tema || 'Sin tema') === temaSeleccionado)
    : ejercicios

  const guardarTema = async (id) => {
    await analisisApi.actualizarTema(id, nuevoTema)
    setEjercicios(prev => prev.map(e => e.id === id ? { ...e, tema_personalizado: nuevoTema } : e))
    setEditandoId(null)
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '220px 1fr 300px',
      gridTemplateRows: '52px calc(100vh - 52px)',
      height: '100vh', overflow: 'hidden'
    }}>
      <Navbar />
      <Sidebar />

      <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
        <h5 style={{ marginBottom: 16 }}>Historial de ejercicios</h5>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <button
            onClick={() => setTemaSeleccionado(null)}
            style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12,
              border: '1px solid #dee2e6', cursor: 'pointer',
              background: !temaSeleccionado ? '#534AB7' : 'white',
              color: !temaSeleccionado ? 'white' : '#495057'
            }}
          >Todos</button>
          {temas.map(tema => (
            <button
              key={tema}
              onClick={() => setTemaSeleccionado(tema)}
              style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12,
                border: '1px solid #dee2e6', cursor: 'pointer',
                background: temaSeleccionado === tema ? '#534AB7' : 'white',
                color: temaSeleccionado === tema ? 'white' : '#495057'
              }}
            >{tema}</button>
          ))}
        </div>

        {ejerciciosFiltrados.length === 0 && (
          <p style={{ color: '#adb5bd', fontSize: 13 }}>No hay ejercicios aún.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ejerciciosFiltrados.map(e => (
            <div key={e.id} style={{
              border: '1px solid #dee2e6', borderRadius: 10,
              padding: '1rem', background: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                {editandoId === e.id ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      value={nuevoTema}
                      onChange={ev => setNuevoTema(ev.target.value)}
                      style={{ padding: '2px 8px', borderRadius: 6, border: '1px solid #dee2e6', fontSize: 12 }}
                    />
                    <button onClick={() => guardarTema(e.id)} style={{
                      padding: '2px 8px', borderRadius: 6, background: '#534AB7',
                      color: 'white', border: 'none', fontSize: 12, cursor: 'pointer'
                    }}>guardar</button>
                  </div>
                ) : (
                  <span
                    onClick={() => { setEditandoId(e.id); setNuevoTema(e.tema_personalizado || e.tema || '') }}
                    style={{
                      fontSize: 12, background: '#EEEDFE', color: '#534AB7',
                      padding: '2px 10px', borderRadius: 20, cursor: 'pointer'
                    }}
                  >
                    {e.tema_personalizado || e.tema || 'Sin tema'} ✏️
                  </span>
                )}
                <span style={{ fontSize: 11, color: '#adb5bd' }}>
                  {new Date(e.creado_en).toLocaleDateString()}
                </span>
              </div>
              <SectionLabel>ejercicio</SectionLabel>
              <p style={{ fontSize: 13, fontFamily: 'monospace', marginBottom: 8 }}>{e.enunciado}</p>
              <SectionLabel>pasos</SectionLabel>
              <p style={{ fontSize: 13, color: '#495057', whiteSpace: 'pre-wrap' }}>{e.pasos}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderLeft: '1px solid #dee2e6', padding: '1rem' }}>
        <SectionLabel>carpetas por tema</SectionLabel>
        {temas.map(tema => (
          <div
            key={tema}
            onClick={() => setTemaSeleccionado(tema === temaSeleccionado ? null : tema)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 8px', borderRadius: 8, fontSize: 13,
              cursor: 'pointer', marginBottom: 4,
              background: temaSeleccionado === tema ? '#EEEDFE' : 'transparent',
              color: temaSeleccionado === tema ? '#534AB7' : '#495057'
            }}
          >
            📁 {tema}
          </div>
        ))}
      </div>
    </div>
  )
}