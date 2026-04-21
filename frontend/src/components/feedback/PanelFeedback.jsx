import Button from '../ui/Button'

export default function PanelFeedback({ resultado, cargando, onAnalizarGeneral }) {
  const renderLineas = (texto) =>
    texto.split('\n').map((linea, i) => {
      if (linea.startsWith('✅')) return (
        <div key={i} style={{
          padding: '6px 10px', borderRadius: 6, marginBottom: 4,
          background: '#EAF3DE', color: '#3B6D11',
          borderLeft: '3px solid #639922'
        }}>{linea}</div>
      )
      if (linea.startsWith('❌')) return (
        <div key={i} style={{
          padding: '6px 10px', borderRadius: 6, marginBottom: 4,
          background: '#FCEBEB', color: '#A32D2D',
          borderLeft: '3px solid #E24B4A'
        }}>{linea}</div>
      )
      if (linea.startsWith('📝') || linea.startsWith('✔️') || linea.startsWith('TEMA:')) return (
        <div key={i} style={{
          padding: '6px 10px', borderRadius: 6, marginBottom: 4,
          background: '#EEEDFE', color: '#534AB7',
          borderLeft: '3px solid #7F77DD'
        }}>{linea}</div>
      )
      if (linea.trim() === '') return <div key={i} style={{ height: 6 }} />
      return <div key={i}>{linea}</div>
    })

  return (
    <div style={{
      borderLeft: '1px solid #dee2e6', background: 'white',
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{
        padding: '10px 1rem', borderBottom: '1px solid #dee2e6',
        fontWeight: 500, fontSize: 13
      }}>
        Análisis del procedimiento
      </div>

      <div style={{
        flex: 1, padding: '1rem', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 10
      }}>
        {cargando && (
          <p style={{ textAlign: 'center', color: '#6c757d', marginTop: 20, fontSize: 13 }}>
            Analizando tu procedimiento...
          </p>
        )}

        {!cargando && !resultado && (
          <p style={{ color: '#6c757d', fontSize: 13, marginTop: 20, textAlign: 'center' }}>
            Escribe tu ejercicio y pasos,<br />luego presiona "Analizar".
          </p>
        )}

        {resultado && !resultado.tiene_contexto && !resultado.analisis && resultado.mensaje && (
          <div>
            <div style={{
              padding: '10px 12px', borderRadius: 8, fontSize: 13,
              background: '#EEEDFE', color: '#534AB7',
              borderLeft: '3px solid #7F77DD', marginBottom: 12
            }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Sin material del profesor</div>
              {resultado.mensaje}
            </div>
            <Button variant="secondary" fullWidth onClick={onAnalizarGeneral}>
              Resolver con conocimiento general
            </Button>
          </div>
        )}

        {resultado && resultado.analisis && (
          <div>
            <div style={{
              fontSize: 13, lineHeight: 1.9, color: '#212529',
              whiteSpace: 'pre-wrap', fontFamily: 'inherit'
            }}>
              {renderLineas(resultado.analisis)}
            </div>

            <div style={{
              marginTop: 16, paddingTop: 12,
              borderTop: '1px solid #dee2e6'
            }}>
              <p style={{ fontSize: 11, color: '#adb5bd', marginBottom: 8 }}>
                ¿El análisis no usa el método correcto?
              </p>
              <Button variant="secondary" fullWidth onClick={onAnalizarGeneral}>
                Analizar con conocimiento general
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}