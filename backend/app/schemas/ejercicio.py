from pydantic import BaseModel
from datetime import datetime

class EjercicioResponse(BaseModel):
    id: int
    enunciado: str
    pasos: str
    analisis: str | None
    tema: str | None
    tema_personalizado: str | None
    creado_en: datetime

    model_config = {"from_attributes": True}

class ActualizarTema(BaseModel):
    tema_personalizado: str