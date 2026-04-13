from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.analisis import AnalisisRequest, AnalisisResponse, AnalisisConKnowledgeRequest
from app.schemas.ejercicio import EjercicioResponse, ActualizarTema
from app.services.analisis_service import analizar_ejercicio, analizar_con_conocimiento_general
from app.repositories.ejercicio_repo import EjercicioRepository
from app.models.ejercicio import Ejercicio

router = APIRouter(prefix="/analisis", tags=["analisis"])

@router.post("/analizar", response_model=AnalisisResponse)
def analizar(datos: AnalisisRequest, db: Session = Depends(get_db)):
    resultado = analizar_ejercicio(datos.usuario_id, datos.ejercicio, datos.pasos)

    if resultado["tiene_contexto"] or resultado.get("analisis"):
        repo = EjercicioRepository(db)
        ejercicio = Ejercicio(
            usuario_id=datos.usuario_id,
            enunciado=datos.ejercicio,
            pasos=datos.pasos,
            analisis=resultado.get("analisis"),
            tema=resultado.get("tema")
        )
        repo.crear(ejercicio)

    return resultado

@router.post("/analizar-general", response_model=AnalisisResponse)
def analizar_general(datos: AnalisisConKnowledgeRequest, db: Session = Depends(get_db)):
    resultado = analizar_con_conocimiento_general(datos.ejercicio, datos.pasos)

    repo = EjercicioRepository(db)
    ejercicio = Ejercicio(
        usuario_id=datos.usuario_id,
        enunciado=datos.ejercicio,
        pasos=datos.pasos,
        analisis=resultado.get("analisis"),
        tema=resultado.get("tema")
    )
    repo.crear(ejercicio)

    return resultado

@router.get("/historial/{usuario_id}", response_model=list[EjercicioResponse])
def historial(usuario_id: int, db: Session = Depends(get_db)):
    repo = EjercicioRepository(db)
    return repo.obtener_por_usuario(usuario_id)

@router.patch("/ejercicio/{ejercicio_id}/tema")
def actualizar_tema(ejercicio_id: int, datos: ActualizarTema, db: Session = Depends(get_db)):
    repo = EjercicioRepository(db)
    return repo.actualizar_tema(ejercicio_id, datos.tema_personalizado)