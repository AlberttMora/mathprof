import { useState, useEffect } from 'react'
import { documentosApi } from '../api/documentosApi'

export const useDocumentos = (usuarioId) => {
  const [documentos, setDocumentos] = useState([])
  const [subiendo, setSubiendo] = useState(false)

  const cargarDocumentos = async () => {
    try {
      const data = await documentosApi.listar(usuarioId)
      setDocumentos(data)
    } catch {
      setDocumentos([])
    }
  }

  const subirDocumento = async (archivo) => {
    setSubiendo(true)
    try {
      await documentosApi.subir(archivo, usuarioId)
      await cargarDocumentos()
    } finally {
      setSubiendo(false)
    }
  }

  useEffect(() => {
    cargarDocumentos()
  }, [usuarioId])

  return { documentos, subiendo, subirDocumento, cargarDocumentos }
}