from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Ejercicio(Base):
    __tablename__ = "ejercicios"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    enunciado = Column(Text, nullable=False)
    pasos = Column(Text, nullable=False)
    analisis = Column(Text, nullable=True)
    tema = Column(String(150), nullable=True)
    tema_personalizado = Column(String(150), nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())