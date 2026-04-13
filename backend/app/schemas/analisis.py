from pydantic import BaseModel

class AnalisisRequest(BaseModel):
    usuario_id: int
    ejercicio: str
    pasos: str

class AnalisisResponse(BaseModel):
    tiene_contexto: bool
    analisis: str | None = None
    mensaje: str | None = None
    tema: str | None = None

class AnalisisConKnowledgeRequest(BaseModel):
    usuario_id: int
    ejercicio: str
    pasos: str
    usar_conocimiento_general: bool = False