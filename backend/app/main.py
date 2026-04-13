from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.api.v1 import auth, analisis, documentos

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MathProf API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(analisis.router)
app.include_router(documentos.router)

@app.get("/")
def root():
    return {"message": "MathProf API v2.0 corriendo"}