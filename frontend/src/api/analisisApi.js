import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

export const analisisApi = {
  analizar: async (usuarioId, ejercicio, pasos) => {
    const { data } = await axios.post(`${BASE_URL}/analisis/analizar`, {
      usuario_id: usuarioId,
      ejercicio,
      pasos
    })
    return data
  },

  analizarGeneral: async (usuarioId, ejercicio, pasos) => {
    const { data } = await axios.post(`${BASE_URL}/analisis/analizar-general`, {
      usuario_id: usuarioId,
      ejercicio,
      pasos,
      usar_conocimiento_general: true
    })
    return data
  },

  obtenerHistorial: async (usuarioId) => {
    const { data } = await axios.get(`${BASE_URL}/analisis/historial/${usuarioId}`)
    return data
  },

  actualizarTema: async (ejercicioId, temaPersonalizado) => {
    const { data } = await axios.patch(
      `${BASE_URL}/analisis/ejercicio/${ejercicioId}/tema`,
      { tema_personalizado: temaPersonalizado }
    )
    return data
  }
}