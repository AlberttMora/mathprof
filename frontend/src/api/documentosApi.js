import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

export const documentosApi = {
  subir: async (archivo, usuarioId) => {
    const form = new FormData()
    form.append('archivo', archivo)
    form.append('usuario_id', usuarioId)
    const { data } = await axios.post(`${BASE_URL}/documentos/subir`, form)
    return data
  },

  listar: async (usuarioId) => {
    const { data } = await axios.get(`${BASE_URL}/documentos/lista/${usuarioId}`)
    return data
  }
}