import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

export const authApi = {
  login: async (email, password) => {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, { email, password })
    return data
  },

  registro: async (nombre, email, password) => {
    const { data } = await axios.post(`${BASE_URL}/auth/registro`, { nombre, email, password })
    return data
  }
}