from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.rag_service import procesar_pdf
from app.models.documento import Documento
import shutil
import os

router = APIRouter(prefix="/documentos", tags=["documentos"])

@router.post("/subir")
async def subir_documento(
    archivo: UploadFile = File(...),
    usuario_id: int = Form(...)  ,
    db: Session = Depends(get_db)
):
    os.makedirs("pdfs_temp", exist_ok=True)
    ruta = f"pdfs_temp/{archivo.filename}"

    with open(ruta, "wb") as f:
        shutil.copyfileobj(archivo.file, f)

    chunks = procesar_pdf(ruta, usuario_id, archivo.filename)
    os.remove(ruta)

    doc = Documento(
        usuario_id=usuario_id,
        nombre=archivo.filename,
        tamanio_mb=0
    )
    db.add(doc)
    db.commit()

    return {
        "mensaje": "PDF procesado correctamente",
        "chunks_generados": chunks,
        "archivo": archivo.filename
    }

@router.get("/lista/{usuario_id}")
def listar_documentos(usuario_id: int, db: Session = Depends(get_db)):
    docs = db.query(Documento).filter(Documento.usuario_id == usuario_id).all()
    return docs