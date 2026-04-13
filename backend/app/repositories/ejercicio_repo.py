from sqlalchemy.orm import Session
from app.models.ejercicio import Ejercicio

class EjercicioRepository:
    def __init__(self, db: Session):
        self.db = db

    def crear(self, ejercicio: Ejercicio) -> Ejercicio:
        self.db.add(ejercicio)
        self.db.commit()
        self.db.refresh(ejercicio)
        return ejercicio

    def obtener_por_usuario(self, usuario_id: int) -> list[Ejercicio]:
        return self.db.query(Ejercicio).filter(
            Ejercicio.usuario_id == usuario_id
        ).order_by(Ejercicio.creado_en.desc()).all()

    def obtener_por_tema(self, usuario_id: int, tema: str) -> list[Ejercicio]:
        return self.db.query(Ejercicio).filter(
            Ejercicio.usuario_id == usuario_id,
            Ejercicio.tema == tema
        ).all()

    def actualizar_tema(self, ejercicio_id: int, tema_personalizado: str) -> Ejercicio | None:
        ejercicio = self.db.query(Ejercicio).filter(Ejercicio.id == ejercicio_id).first()
        if not ejercicio:
            return None
        ejercicio.tema_personalizado = tema_personalizado
        self.db.commit()
        self.db.refresh(ejercicio)
        return ejercicio