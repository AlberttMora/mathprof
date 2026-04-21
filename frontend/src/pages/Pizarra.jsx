import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import PanelSimbolos from '../components/pizarra/PanelSimbolos'
import EditorEjercicio from '../components/pizarra/EditorEjercicio'
import EditorPasos from '../components/pizarra/EditorPasos'
import PanelFeedback from '../components/feedback/PanelFeedback'
import Button from '../components/ui/Button'
import { usePizarra } from '../hooks/usePizarra'

export default function Pizarra() {
  const {
    resultado, cargando, setPasos,
    insertarSimbolo, analizar, analizarConKnowledgeGeneral,
    limpiarTodo, ejercicioEditorRef, activeEditorRef
  } = usePizarra()

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '220px 1fr 300px',
      gridTemplateRows: '52px calc(100vh - 52px)',
      height: '100vh', overflow: 'hidden'
    }}>
      <Navbar />
      <Sidebar />

      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'white' }}>
        <PanelSimbolos onInsert={insertarSimbolo} />

        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <EditorEjercicio
            editorRef={ejercicioEditorRef}
            activeEditorRef={activeEditorRef}
          />
          <EditorPasos
            onChange={setPasos}
            activeEditorRef={activeEditorRef}
          />
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 1rem', borderTop: '1px solid #dee2e6'
        }}>
          <Button variant="secondary" onClick={limpiarTodo}>limpiar pizarra</Button>
          <Button onClick={analizar} disabled={cargando}>
            {cargando ? 'analizando...' : 'analizar procedimiento'}
          </Button>
        </div>
      </div>

      <PanelFeedback
        resultado={resultado}
        cargando={cargando}
        onAnalizarGeneral={analizarConKnowledgeGeneral}
      />
    </div>
  )
}