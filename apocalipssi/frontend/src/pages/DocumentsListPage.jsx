"use client"

import { useState, useEffect } from "react"
import DocumentAnalysis from "../components/DocumentAnalysis"

const DocumentsListPage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDocumentId, setSelectedDocumentId] = useState(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:5000/documents")
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des documents")
      }
      const data = await response.json()
      setDocuments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = (documentId) => {
    setSelectedDocumentId(documentId)
  }

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await fetch(`http://localhost:5000/documents/download/${fileId}`)
      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert("Erreur lors du téléchargement: " + err.message)
    }
  }

  const handleDelete = async (documentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/documents/${documentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      setDocuments(documents.filter((doc) => doc._id !== documentId))
      alert("Document supprimé avec succès")
    } catch (err) {
      alert("Erreur lors de la suppression: " + err.message)
    }
  }

  if (loading) {
    return (
      <div className="app-container">
        <header className="header">
          <h1>Liste des documents</h1>
        </header>
        <main>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Chargement des documents...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container">
        <header className="header">
          <h1>Liste des documents</h1>
        </header>
        <main>
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={fetchDocuments} className="retry-button">
              Réessayer
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>📚 Liste des documents ({documents.length})</h1>
      </header>
      <main>
        <div className="documents-container">
          {documents.length === 0 ? (
            <div className="empty-state">
              <p>Aucun document trouvé</p>
            </div>
          ) : (
            <div className="documents-grid">
              {documents.map((doc) => (
                <div key={doc._id} className="document-card">
                  <div className="document-header">
                    <h3>{doc.originalName}</h3>
                    <span className="document-date">{new Date(doc.uploadDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="document-info">
                    <p>
                      <strong>Utilisateur:</strong> {doc.username}
                    </p>
                    <p>
                      <strong>ID:</strong> {doc._id}
                    </p>
                  </div>
                  <div className="document-actions">
                    <button onClick={() => handleAnalyze(doc._id)} className="action-button analyze-button">
                      🤖 Analyser
                    </button>
                    <button
                      onClick={() => handleDownload(doc.fileId, doc.originalName)}
                      className="action-button download-button"
                    >
                      📥 Télécharger
                    </button>
                    <button onClick={() => handleDelete(doc._id)} className="action-button delete-button">
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedDocumentId && (
        <DocumentAnalysis documentId={selectedDocumentId} onClose={() => setSelectedDocumentId(null)} />
      )}
    </div>
  )
}

export default DocumentsListPage
