import katex from 'katex'
import 'katex/dist/katex.min.css'
import { CATEGORIAS_SIMBOLOS } from '../../utils/latexUtils.jsx'

/**
 * BotonSimbolo — Renderiza el símbolo matemático real usando KaTeX.
 * Al hacer clic inserta el LaTeX en el editor activo.
 */
function BotonSimbolo({ label, latex, onInsert }) {
  // Usamos el label directo para botones con estructuras complejas
  // y KaTeX solo para símbolos simples que se ven bien
  const esComplejo = latex.includes('{}') || latex.includes('frac') || latex.includes('sqrt')

  let html = label
  if (!esComplejo) {
    try {
      html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: false
      })
    } catch {
      html = label
    }
  }

  return (
    <button
      type="button"
      onClick={() => onInsert(latex)}
      title={latex}
      style={{
        padding: '4px 10px', border: '1px solid #dee2e6',
        borderRadius: 6, background: 'white', cursor: 'pointer',
        minWidth: 36, minHeight: 32, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: esComplejo ? 13 : 14, fontFamily: esComplejo ? 'serif' : 'inherit'
      }}
      {...(esComplejo
        ? { children: label }
        : { dangerouslySetInnerHTML: { __html: html } }
      )}
    />
  )
}

export default function PanelSimbolos({ onInsert }) {
  return (
    <div style={{
      borderBottom: '1px solid #dee2e6', background: '#f8f9fa',
      maxHeight: 200, overflowY: 'auto', padding: '8px 12px'
    }}>
      {Object.entries(CATEGORIAS_SIMBOLOS).map(([cat, simbolos]) => (
        <div key={cat} style={{ marginBottom: 8 }}>
          <div style={{
            fontSize: 10, color: '#6c757d',
            textTransform: 'uppercase', marginBottom: 4, fontWeight: 500
          }}>
            {cat}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {simbolos.map(({ label, latex }) => (
              <BotonSimbolo key={latex} label={label} latex={latex} onInsert={onInsert} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}