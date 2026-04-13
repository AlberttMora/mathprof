from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from app.core.config import settings
from app.services.rag_service import buscar_contexto

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="llama3-70b-8192"
)

def _construir_prompt_con_contexto(contexto: str, ejercicio: str, pasos: str) -> str:
    return f"""Eres un asistente matemático que corrige ejercicios según el método del profesor.

MATERIAL DEL PROFESOR:
{contexto}

EJERCICIO DEL ESTUDIANTE:
{ejercicio}

PASOS DEL ESTUDIANTE:
{pasos}

Analiza los pasos basándote ÚNICAMENTE en el material del profesor. Responde en este formato exacto:

TEMA: [nombre corto del tema detectado, ej: Límites por factorización]

✅ PASOS CORRECTOS:
[lista los pasos correctos y por qué]

❌ PASOS INCORRECTOS:
[lista los errores y por qué]

📝 CÓMO DEBIÓ RESOLVERSE:
[solución correcta según el método del profesor]

✔️ RESULTADO CORRECTO:
[resultado final]
"""

def _construir_prompt_general(ejercicio: str, pasos: str) -> str:
    return f"""Eres un asistente matemático experto. Analiza el siguiente ejercicio y procedimiento.

EJERCICIO:
{ejercicio}

PASOS DEL ESTUDIANTE:
{pasos}

Analiza los pasos y responde en este formato exacto:

TEMA: [nombre corto del tema detectado]

✅ PASOS CORRECTOS:
[lista los pasos correctos]

❌ PASOS INCORRECTOS:
[lista los errores]

📝 CÓMO DEBIÓ RESOLVERSE:
[solución correcta]

✔️ RESULTADO CORRECTO:
[resultado final]
"""

def _extraer_tema(analisis: str) -> str | None:
    for linea in analisis.split("\n"):
        if linea.startswith("TEMA:"):
            return linea.replace("TEMA:", "").strip()
    return None

def analizar_ejercicio(usuario_id: int, ejercicio: str, pasos: str) -> dict:
    contexto = buscar_contexto(usuario_id, ejercicio)

    if not contexto:
        return {
            "tiene_contexto": False,
            "mensaje": "No encontré este tema en el material del profesor. ¿Deseas resolverlo con conocimiento general?",
            "analisis": None,
            "tema": None
        }

    prompt = _construir_prompt_con_contexto(contexto, ejercicio, pasos)
    respuesta = llm.invoke([HumanMessage(content=prompt)])
    tema = _extraer_tema(respuesta.content)

    return {
        "tiene_contexto": True,
        "analisis": respuesta.content,
        "tema": tema,
        "mensaje": None
    }

def analizar_con_conocimiento_general(ejercicio: str, pasos: str) -> dict:
    prompt = _construir_prompt_general(ejercicio, pasos)
    respuesta = llm.invoke([HumanMessage(content=prompt)])
    tema = _extraer_tema(respuesta.content)

    return {
        "tiene_contexto": False,
        "analisis": respuesta.content,
        "tema": tema,
        "mensaje": None
    }