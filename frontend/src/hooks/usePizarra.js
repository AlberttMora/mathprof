import { useRef } from 'react'
import { usePizarraStore } from '../store/usePizarraStore'
import { analisisApi } from '../api/analisisApi'

/**
 * usePizarra — Controller principal de la pizarra.
 * Separa lógica de negocio de la vista.
 * activeEditorRef rastrea cuál editor tiene el foco para inserción correcta.
 */
export const usePizarra = () => {
  const {
    ejercicio, setEjercicio,
    pasos, setPasos,
    resultado, setResultado,
    cargando, setCargando, limpiar
  } = usePizarraStore()

  const ejercicioEditorRef = useRef(null)
  const activeEditorRef = useRef(null)

  // Inserta en el editor que tenga foco actualmente
  const insertarSimbolo = (latex) => {
    const el = activeEditorRef.current
    if (!el) return
    el.executeCommand?.(['insert', latex, { insertionMode: 'insertAfter' }])
    el.focus?.()
  }

  const analizar = async () => {
    const ejercicioLatex = ejercicioEditorRef.current?.value || ejercicio
    if (!ejercicioLatex.trim()) return

    setCargando(true)
    setResultado(null)
    try {
      const data = await analisisApi.analizar(1, ejercicioLatex, pasos)
      setResultado(data)
    } catch {
      setResultado({ tiene_contexto: false, mensaje: 'Error al conectar con el servidor.' })
    } finally {
      setCargando(false)
    }
  }

  const analizarConKnowledgeGeneral = async () => {
    const ejercicioLatex = ejercicioEditorRef.current?.value || ejercicio
    setCargando(true)
    try {
      const data = await analisisApi.analizarGeneral(1, ejercicioLatex, pasos)
      setResultado(data)
    } catch {
      setResultado({ tiene_contexto: false, mensaje: 'Error al conectar con el servidor.' })
    } finally {
      setCargando(false)
    }
  }

  const limpiarTodo = () => {
    limpiar()
    if (ejercicioEditorRef.current) ejercicioEditorRef.current.value = ''
  }

  return {
    ejercicio, pasos, resultado, cargando,
    setEjercicio, setPasos,
    insertarSimbolo, analizar, analizarConKnowledgeGeneral,
    limpiarTodo, ejercicioEditorRef, activeEditorRef
  }
}