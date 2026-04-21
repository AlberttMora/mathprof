import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import 'mathlive'

/**
 * MathEditor — Componente atómico de edición matemática.
 * Usa MathLive para renderizado y edición interactiva de LaTeX.
 * Expone métodos imperativos via ref para inserción desde PanelSimbolos.
 */
const MathEditor = forwardRef(({ onChange, onFocus, minHeight = 80, placeholder = '' }, ref) => {
  const mlRef = useRef(null)

  useImperativeHandle(ref, () => ({
    insertar: (latex) => {
      if (!mlRef.current) return
      mlRef.current.executeCommand(['insert', latex, { insertionMode: 'insertAfter' }])
      mlRef.current.focus()
    },
    getLatex: () => mlRef.current?.value || '',
    limpiar: () => {
      if (mlRef.current) mlRef.current.value = ''
    }
  }))

  useEffect(() => {
    const el = mlRef.current
    if (!el) return

    el.setOptions({
      virtualKeyboardMode: 'off',
      smartFence: true,
      smartSuperscript: true,
      placeholderSymbol: placeholder,
    })

    const handleInput = () => onChange?.(el.value)
    const handleFocus = () => onFocus?.()

    el.addEventListener('input', handleInput)
    el.addEventListener('focus', handleFocus)

    return () => {
      el.removeEventListener('input', handleInput)
      el.removeEventListener('focus', handleFocus)
    }
  }, [])

  return (
    <math-field
      ref={mlRef}
      style={{
        width: '100%',
        minHeight,
        border: '1px dashed #ced4da',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 20,
        background: 'white',
        display: 'block',
        outline: 'none',
      }}
    />
  )
})

MathEditor.displayName = 'MathEditor'
export default MathEditor