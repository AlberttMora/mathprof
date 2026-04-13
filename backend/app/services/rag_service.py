from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb
import os
from dotenv import load_dotenv

load_dotenv()

chroma_client = chromadb.PersistentClient(path="./chroma_data")

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama3-70b-8192"
)

def procesar_pdf(pdf_path: str, usuario_id: int, nombre_pdf: str):
    loader = PyPDFLoader(pdf_path)
    pages = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = splitter.split_documents(pages)

    collection = chroma_client.get_or_create_collection(
        name=f"usuario_{usuario_id}"
    )

    for i, chunk in enumerate(chunks):
        collection.add(
            documents=[chunk.page_content],
            metadatas=[{"fuente": nombre_pdf, "pagina": chunk.metadata.get("page", 0)}],
            ids=[f"{nombre_pdf}_{i}"]
        )

    return len(chunks)

def buscar_contexto(usuario_id: int, pregunta: str, n_resultados: int = 5):
    try:
        collection = chroma_client.get_collection(f"usuario_{usuario_id}")
        resultados = collection.query(
            query_texts=[pregunta],
            n_results=n_resultados
        )
        return "\n\n".join(resultados["documents"][0])
    except:
        return None

def analizar_ejercicio(usuario_id: int, ejercicio: str, pasos: str):
    contexto = buscar_contexto(usuario_id, ejercicio)

    if contexto:
        prompt = f"""Eres un asistente matemático que corrige ejercicios según el método del profesor.

MATERIAL DEL PROFESOR:
{contexto}

EJERCICIO DEL ESTUDIANTE:
{ejercicio}

PASOS DEL ESTUDIANTE:
{pasos}

Analiza los pasos del estudiante basándote ÚNICAMENTE en el material del profesor. Indica:
1. ✅ Pasos correctos
2. ❌ Pasos incorrectos y por qué
3. 📝 Cómo debió resolverse según el método del profesor
4. ✔️ Resultado correcto
"""
    else:
        return {
            "tiene_contexto": False,
            "mensaje": "No encontré este tema en el material del profesor. ¿Deseas que lo resuelva con conocimiento general?"
        }

    from langchain_core.messages import HumanMessage
    respuesta = llm.invoke([HumanMessage(content=prompt)])

    return {
        "tiene_contexto": True,
        "analisis": respuesta.content
    }