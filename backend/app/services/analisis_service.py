from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from app.core.config import settings
from app.services.rag_service import buscar_contexto

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="llama-3.3-70b-versatile"
)

def _construir_prompt_con_contexto(contexto: str, ejercicio: str, pasos: str) -> str:
    return f"""Eres un asistente matemático que corrige ejercicios de estudiantes universitarios.

INSTRUCCIONES IMPORTANTES:
- Corrige ÚNICAMENTE el ejercicio que te presento, no inventes otros ejercicios
- Usa el material del profesor solo como referencia del método a seguir
- Si el estudiante no escribió pasos, indícalo y muestra cómo debió resolverse
- Responde siempre en español

MATERIAL DEL PROFESOR (método de referencia):
{contexto}

EJERCICIO DEL ESTUDIANTE:
{ejercicio}

PASOS DEL ESTUDIANTE:
{pasos if pasos.strip() else "El estudiante no escribió pasos"}

Responde EXACTAMENTE en este formato:

TEMA: [nombre corto del tema]

✅ PASOS CORRECTOS:
[qué hizo bien, o "Ninguno" si no hay pasos]

❌ PASOS INCORRECTOS:
[qué errores cometió y por qué, o "Ninguno" si todo está bien]

📝 SOLUCIÓN CORRECTA:
[solución paso a paso según el método del profesor]

✔️ RESULTADO:
[resultado final]
"""

def _construir_prompt_general(ejercicio: str, pasos: str) -> str:
    return f"""Eres un asistente matemático experto universitario.

INSTRUCCIONES:
- Corrige ÚNICAMENTE el ejercicio presentado
- No inventes ejercicios adicionales
- Responde en español

EJERCICIO:
{ejercicio}

PASOS DEL ESTUDIANTE:
{pasos if pasos.strip() else "El estudiante no escribió pasos"}

Responde EXACTAMENTE en este formato:

TEMA: [nombre corto del tema]

✅ PASOS CORRECTOS:
[qué hizo bien]

❌ PASOS INCORRECTOS:
[qué errores cometió]

📝 SOLUCIÓN CORRECTA:
[solución paso a paso]

✔️ RESULTADO:
[resultado final]
"""

def _extraer_tema(analisis: str) -> str | None:
    for linea in analisis.split("\n"):
        if linea.startswith("TEMA:"):
            return linea.replace("TEMA:", "").strip()
    return None

def analizar_ejercicio(usuario_id: int, ejercicio: str, pasos: str) -> dict:
    contexto = buscar_contexto(usuario_id, ejercicio)
    print("CONTEXTO:", contexto[:300] if contexto else "NINGUNO")

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