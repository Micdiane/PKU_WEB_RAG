from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json
import re

from app.models.models import Document, DocumentChunk
from app.services.document_service import DocumentService
from app.core.config import settings

class RAGService:
    def __init__(self, db: Session):
        self.db = db
        self.document_service = DocumentService(db)
    
    def _chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """Split text into overlapping chunks"""
        if not text:
            return []
        
        # Simple sentence-based chunking
        sentences = re.split(r'[.!?]+', text)
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            if len(current_chunk) + len(sentence) < chunk_size:
                current_chunk += sentence + ". "
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sentence + ". "
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def _get_dummy_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate dummy embeddings for demonstration"""
        # Simple hash-based pseudo-embeddings for demo purposes
        embeddings = []
        for text in texts:
            # Create a simple embedding based on text characteristics
            words = text.lower().split()
            embedding = [0.0] * 384  # Standard embedding size
            
            # Fill embedding with simple features
            for i, word in enumerate(words[:384]):
                embedding[i] = hash(word) % 100 / 100.0
            
            embeddings.append(embedding)
        
        return embeddings
    
    async def index_document(self, document_id: int) -> bool:
        """Index a document for RAG search"""
        document = self.document_service.get_document(document_id)
        if not document:
            return False
        
        content = self.document_service.get_document_content(document_id)
        if not content:
            return False
        
        # Delete existing chunks
        self.db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document_id
        ).delete()
        
        # Create new chunks
        chunks = self._chunk_text(content)
        if not chunks:
            return False
        
        # Generate dummy embeddings
        embeddings = self._get_dummy_embeddings(chunks)
        
        # Store chunks with embeddings
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            db_chunk = DocumentChunk(
                document_id=document_id,
                content=chunk,
                chunk_index=i,
                embedding_vector=json.dumps(embedding)
            )
            self.db.add(db_chunk)
        
        # Mark document as indexed
        document.is_indexed = True
        
        self.db.commit()
        return True
    
    def _calculate_similarity(self, query_embedding: List[float], chunk_embedding: List[float]) -> float:
        """Calculate simple similarity based on word overlap"""
        try:
            # Simple cosine similarity implementation
            dot_product = sum(a * b for a, b in zip(query_embedding, chunk_embedding))
            norm_a = sum(a * a for a in query_embedding) ** 0.5
            norm_b = sum(b * b for b in chunk_embedding) ** 0.5
            
            if norm_a == 0 or norm_b == 0:
                return 0.0
            
            return dot_product / (norm_a * norm_b)
        except Exception:
            return 0.0
    
    async def query_documents(self, query: str, user_id: int, top_k: int = 5) -> Dict[str, Any]:
        """Query documents using simple text matching"""
        if not query.strip():
            return {
                "answer": "Please provide a valid query.",
                "sources": [],
                "confidence": 0.0
            }
        
        # Get all indexed document chunks for the user
        chunks = self.db.query(DocumentChunk).join(Document).filter(
            Document.owner_id == user_id,
            Document.is_indexed == True
        ).all()
        
        if not chunks:
            return {
                "answer": "No indexed documents found. Please upload and index some documents first.",
                "sources": [],
                "confidence": 0.0
            }
        
        # Simple text-based similarity scoring
        query_words = set(query.lower().split())
        chunk_similarities = []
        
        for chunk in chunks:
            chunk_words = set(chunk.content.lower().split())
            overlap = len(query_words.intersection(chunk_words))
            similarity = overlap / len(query_words.union(chunk_words)) if query_words.union(chunk_words) else 0.0
            
            if similarity > 0:
                chunk_similarities.append((chunk, similarity))
        
        # Sort by similarity and get top k
        chunk_similarities.sort(key=lambda x: x[1], reverse=True)
        top_chunks = chunk_similarities[:top_k]
        
        if not top_chunks:
            return {
                "answer": "No relevant content found for your query.",
                "sources": [],
                "confidence": 0.0
            }
        
        # Generate answer from top chunks
        relevant_content = []
        sources = []
        
        for chunk, similarity in top_chunks:
            if similarity > 0.05:  # Minimum similarity threshold
                relevant_content.append(chunk.content)
                sources.append({
                    "document_id": chunk.document.id,
                    "document_title": chunk.document.title,
                    "chunk_content": chunk.content[:200] + "..." if len(chunk.content) > 200 else chunk.content,
                    "similarity": similarity
                })
        
        if not relevant_content:
            return {
                "answer": "No sufficiently relevant content found for your query.",
                "sources": [],
                "confidence": 0.0
            }
        
        # Simple answer generation
        answer = f"Based on your query '{query}', here's what I found:\\n\\n"
        answer += "\\n\\n".join(relevant_content[:3])  # Top 3 most relevant chunks
        
        avg_confidence = sum(sim for _, sim in top_chunks) / len(top_chunks) if top_chunks else 0.0
        
        return {
            "answer": answer,
            "sources": sources,
            "confidence": min(avg_confidence, 1.0)
        }