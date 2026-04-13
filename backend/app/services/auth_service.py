from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate
from app.core.security import hash_password, verify_password, create_access_token
from fastapi import HTTPException, status

def registrar_usuario(db: Session, datos: UsuarioCreate) -> Usuario:
    existente = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    usuario = Usuario(
        nombre=datos.nombre,
        email=datos.email,
        password_hash=hash_password(datos.password)
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

def login_usuario(db: Session, email: str, password: str) -> dict:
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario or not verify_password(password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    token = create_access_token({"sub": str(usuario.id), "email": usuario.email})
    return {"access_token": token, "token_type": "bearer"}