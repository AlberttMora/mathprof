import { create } from 'zustand'

export const usePizarraStore = create((set) => ({
  ejercicio: '',
  pasos: '',
  resultado: null,
  cargando: false,

  setEjercicio: (ejercicio) => set({ ejercicio }),
  setPasos: (pasos) => set({ pasos }),
  setResultado: (resultado) => set({ resultado }),
  setCargando: (cargando) => set({ cargando }),
  limpiar: () => set({ ejercicio: '', pasos: '', resultado: null, cargando: false })
}))