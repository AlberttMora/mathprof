import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  usuario: null,
  token: null,
  isAuthenticated: false,

  setUsuario: (usuario) => set({ usuario, isAuthenticated: true }),
  setToken: (token) => set({ token, isAuthenticated: true }),
  logout: () => set({ usuario: null, token: null, isAuthenticated: false })
}))