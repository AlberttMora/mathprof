import { useRef, useState } from 'react'
import MathEditor from './MathEditor'
import SectionLabel from '../ui/SectionLabel'

/**
 * EditorPasos — Pizarra multilínea.
 * Cada paso es un MathEditor independiente.
 * Enter crea un nuevo paso, simulando una hoja de cuaderno.
 */
export default function EditorPasos({ onChange, activeEditorRef }) {
  const [pasos, setPasos] = useState([{ id: 1, latex: '' }])
  const refs = useRef({})

  const actualizarPaso = (id, latex) => {
    const nuevos = pasos.map(p => p.id === id ? { ...p, latex } : p)
    setPasos(nuevos)
    onChange?.(nuevos.map(p => p.latex).join('\n'))
  }

  const agregarPaso = (despuesDeId) => {
    const nuevoId = Date.now()
    const idx = pasos.findIndex(p => p.id === despuesDeId)
    const nuevos = [
      ...pasos.slice(0, idx + 1),
      { id: nuevoId, latex: '' },
      ...pasos.slice(idx + 1)
    ]
    setPasos(nuevos)
    setTimeout(() => refs.current[nuevoId]?.focus(), 50)
  }

  const eliminarPaso = (id) => {
    if (pasos.length === 1) return
    const idx = pasos.findIndex(p => p.id === id)
    const nuevos = pasos.filter(p => p.id !== id)
    setPasos(nuevos)
    const anterior = nuevos[Math.max(0, idx - 1)]
    setTimeout(() => refs.current[anterior.id]?.focus(), 50)
  }

  const limpiarTodo = () => setPasos([{ id: 1, latex: '' }])

  return (
    <div>
      <SectionLabel>tu procedimiento paso a paso</SectionLabel>
      <div style={{
        border: '1px solid #dee2e6', borderRadius: 8,
        background: 'white', overflow: 'hidden'
      }}>
        {pasos.map((paso, idx) => (
          <div
            key={paso.id}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '8px 12px',
              borderBottom: idx < pasos.length - 1 ? '1px dashed #f0f0f0' : 'none',
            }}
          >
            <span style={{
              fontSize: 11, color: '#adb5bd', minWidth: 20,
              paddingTop: 14, userSelect: 'none', fontFamily: 'monospace'
            }}>
              {idx + 1}
            </span>
            <math-field
              ref={el => {
                refs.current[paso.id] = el
                if (el && activeEditorRef) activeEditorRef.current = el
              }}
              onInput={(e) => actualizarPaso(paso.id, e.target.value)}
              onFocus={() => { if (activeEditorRef) activeEditorRef.current = refs.current[paso.id] }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); agregarPaso(paso.id) }
                if (e.key === 'Backspace' && paso.latex === '') { e.preventDefault(); eliminarPaso(paso.id) }
              }}
              style={{
                flex: 1, minHeight: 44, fontSize: 18,
                border: 'none', outline: 'none',
                background: 'transparent', display: 'block'
              }}
            />
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: '#adb5bd', marginTop: 6 }}>
        Presiona Enter para agregar un nuevo paso · Backspace en línea vacía para eliminarla
      </p>
    </div>
  )
}