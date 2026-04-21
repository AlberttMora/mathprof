import MathEditor from './MathEditor'
import SectionLabel from '../ui/SectionLabel'

export default function EditorEjercicio({ onChange, editorRef, editorActivoRef }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <SectionLabel>ejercicio</SectionLabel>

      <MathEditor
        ref={editorRef}
        onChange={onChange}
        onFocus={() => (editorActivoRef.current = 'ejercicio')}
        minHeight={60}
      />

      <p style={{ fontSize: 11, color: '#adb5bd', marginTop: 4 }}>
        Escribe o usa los botones de símbolos
      </p>
    </div>
  )
}