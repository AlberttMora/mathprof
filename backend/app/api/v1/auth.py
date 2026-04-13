from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioResponse, LoginRequest, TokenResponse
from app.services.auth_service import registrar_usuario, login_usuario

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/registro", response_model=UsuarioResponse)
def registro(datos: UsuarioCreate, db: Session = Depends(get_db)):
    return registrar_usuario(db, datos)

@router.post("/login", response_model=TokenResponse)
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    return login_usuario(db, datos.email, datos.password)