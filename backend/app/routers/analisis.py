from fastapi import APIRouter, UploadFile, File, Form
from app.services.rag_service import procesar_pdf, analizar_ejercicio
import shutil
import os

router = APIRouter(prefix="/analisis", tags=["analisis"])

@router.post("/subir-pdf")
async def subir_pdf(
    archivo: UploadFile = File(...),
    usuario_id: int = Form(...)
):
    os.makedirs("pdfs_temp", exist_ok=True)
    ruta = f"pdfs_temp/{archivo.filename}"

    with open(ruta, "wb") as f:
        shutil.copyfileobj(archivo.file, f)

    chunks = procesar_pdf(ruta, usuario_id, archivo.filename)
    os.remove(ruta)

    return {
        "mensaje": f"PDF procesado correctamente",
        "chunks_generados": chunks,
        "archivo": archivo.filename
    }

@router.post("/analizar")
async def analizar(
    usuario_id: int = Form(...),
    ejercicio: str = Form(...),
    pasos: str = Form(...)
):
    resultado = analizar_ejercicio(usuario_id, ejercicio, pasos)
    return resultado