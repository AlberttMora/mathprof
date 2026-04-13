from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb
from app.core.config import settings

chroma_client = chromadb.PersistentClient(path="./chroma_data")

def procesar_pdf(pdf_path: str, usuario_id: int, nombre_pdf: str) -> int:
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
            metadatas=[{
                "fuente": nombre_pdf,
                "pagina": chunk.metadata.get("page", 0)
            }],
            ids=[f"{nombre_pdf}_{i}"]
        )

    return len(chunks)

def buscar_contexto(usuario_id: int, pregunta: str, n_resultados: int = 5) -> str | None:
    try:
        collection = chroma_client.get_collection(f"usuario_{usuario_id}")
        resultados = collection.query(
            query_texts=[pregunta],
            n_results=n_resultados
        )
        return "\n\n".join(resultados["documents"][0])
    except Exception:
        return None