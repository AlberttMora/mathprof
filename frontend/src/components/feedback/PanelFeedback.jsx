import React from 'react';
import SectionLabel from '../ui/SectionLabel';
// Importamos la utilidad en caso de que necesitemos limpiar o formatear algo visualmente
import { renderizarLatex } from '../../utils/latexUtils';

export default function PanelFeedback({ resultado, cargando, calculoRapido }) {
  
  // Estilos internos para mantener el componente autocontenido
  const styles = {
    container: {
      padding: '1.5rem 1rem',
      background: '#ffffff',
      borderLeft: '1px solid #dee2e6',
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    displayCalculadora: {
      background: '#f1f3f5',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e9ecef',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      fontWeight: '700',
      color: '#212529',
      transition: 'all 0.2s ease',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
      minHeight: '80px',
      textAlign: 'center'
    },
    statusBox: {
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: '1.6',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div>
        <SectionLabel>Resultado Rápido</SectionLabel>
        <div style={{
          ...styles.displayCalculadora,
          color: calculoRapido ? '#0d6efd' : '#adb5bd',
          border: calculoRapido ? '1px solid #cfe2ff' : '1px solid #e9ecef'
        }}>
          {calculoRapido ? `= ${calculoRapido}` : '---'}
        </div>
        <p style={{ fontSize: '11px', color: '#6c757d', marginTop: '8px', textAlign: 'center' }}>
          {calculoRapido ? 'Cálculo automático detectado' : 'Esperando una expresión matemática...'}
        </p>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />

      <div>
        <SectionLabel>Análisis de Procedimiento</SectionLabel>
        
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="spinner" style={{ marginBottom: '10px' }}>⌛</div>
            <p style={{ color: '#495057', fontSize: '14px' }}>IA analizando tus pasos...</p>
          </div>
        ) : resultado ? (
          <div style={{
            ...styles.statusBox,
            background: resultado.es_correcto ? '#d1e7dd' : '#f8d7da',
            color: resultado.es_correcto ? '#0f5132' : '#842029',
            border: `1px solid ${resultado.es_correcto ? '#badbcc' : '#f5c2c7'}`
          }}>
            <strong style={{ display: 'block', marginBottom: '5px' }}>
              {resultado.es_correcto ? '✅ ¡Buen trabajo!' : '❌ Hay un detalle que revisar'}
            </strong>
            <p style={{ margin: 0 }}>{resultado.mensaje}</p>
            
            {/* Si el backend devuelve sugerencias adicionales (ej. pasos corregidos) */}
            {resultado.sugerencia && (
              <div style={{ 
                marginTop: '10px', 
                paddingTop: '10px', 
                borderTop: '1px solid rgba(0,0,0,0.1)',
                fontSize: '13px',
                fontStyle: 'italic'
              }}>
                <strong>Sugerencia:</strong> {resultado.sugerencia}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            padding: '20px',
            border: '2px dashed #e9ecef',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#adb5bd'
          }}>
            <p style={{ fontSize: '13px', margin: 0 }}>
              Completa el ejercicio y los pasos, luego presiona <b>"Analizar procedimiento"</b> para recibir feedback.
            </p>
          </div>
        )}
      </div>

      {/* Footer del panel para tips rápidos */}
      <div style={{ marginTop: 'auto', fontSize: '11px', color: '#ced4da' }}>
        Tip: Puedes usar ^ para potencias y / para fracciones.
      </div>
    </div>
  );
}