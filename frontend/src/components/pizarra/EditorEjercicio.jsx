import { useEffect, useRef } from 'react'
import SectionLabel from '../ui/SectionLabel'

/**
 * EditorEjercicio — Campo de entrada del ejercicio usando MathLive.
 * Expone el elemento math-field via ref para inserción y lectura de LaTeX.
 */
export default function EditorEjercicio({ onChange, editorRef, activeEditorRef }) {
  const mlRef = useRef(null)

  useEffect(() => {
    const el = mlRef.current
    if (!el) return

    el.setOptions?.({ virtualKeyboardMode: 'off' })

    const handleInput = () => {
      onChange?.(el.value)
      if (activeEditorRef) activeEditorRef.current = el
    }

    const handleFocus = () => {
      if (activeEditorRef) activeEditorRef.current = el
    }

    el.addEventListener('input', handleInput)
    el.addEventListener('focus', handleFocus)

    // Registrar como editor activo por defecto
    if (activeEditorRef) activeEditorRef.current = el
    if (editorRef) editorRef.current = el

    return () => {
      el.removeEventListener('input', handleInput)
      el.removeEventListener('focus', handleFocus)
    }
  }, [])

  return (
    <div>
      <SectionLabel>ejercicio</SectionLabel>
      <math-field
        ref={mlRef}
        style={{
          width: '100%', minHeight: 56,
          border: '1px solid #dee2e6', borderRadius: 8,
          padding: '8px 14px', fontSize: 20,
          background: 'white', display: 'block', outline: 'none'
        }}
      />
      <p style={{ fontSize: 11, color: '#adb5bd', marginTop: 4 }}>
        Escribe el ejercicio o usa los botones de símbolos
      </p>
    </div>
  )
}