import { useRef } from 'react'
import { usePizarraStore } from '../store/usePizarraStore'
import { analisisApi } from '../api/analisisApi'

export const usePizarra = () => {
  const {
    pasos, setPasos,
    resultado, setResultado,
    cargando, setCargando, limpiar
  } = usePizarraStore()

  const ejercicioEditorRef = useRef(null)
  const activeEditorRef = useRef(null)

  const insertarSimbolo = (latex) => {
    const el = activeEditorRef.current
    if (!el) return
    el.executeCommand?.(['insert', latex, { insertionMode: 'insertAfter' }])
    el.focus?.()
  }

  const analizar = async () => {
    const ejercicioLatex = ejercicioEditorRef.current?.value || ''
    if (!ejercicioLatex.trim()) {
      alert('Escribe un ejercicio primero')
      return
    }

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
    const ejercicioLatex = ejercicioEditorRef.current?.value || ''
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
    pasos, setPasos, resultado, cargando,
    insertarSimbolo, analizar, analizarConKnowledgeGeneral,
    limpiarTodo, ejercicioEditorRef, activeEditorRef
  }
}