"use client"

import React, { useState } from "react"

const DocumentAnalysis = ({ documentId, onClose }) => {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyzeDocument = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:5000/documents/analyze/${documentId}`)

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (documentId) {
      analyzeDocument()
    }
  }, [documentId])

  if (loading) {
    return (
      <div className="analysis-modal">
        <div className="analysis-content">
          <div className="analysis-header">
            <h3>Analyse en cours...</h3>
            <button onClick={onClose} className="close-button">
              ×
            </button>
          </div>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Analyse du document par IA...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="analysis-modal">
        <div className="analysis-content">
          <div className="analysis-header">
            <h3>Erreur d'analyse</h3>
            <button onClick={onClose} className="close-button">
              ×
            </button>
          </div>
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={analyzeDocument} className="retry-button">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  return (
    <div className="analysis-modal">
      <div className="analysis-content">
        <div className="analysis-header">
          <h3>📊 Analyse IA - {analysis.document.nom_original}</h3>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <div className="analysis-body">
          <div className="document-info">
            <p>
              <strong>Utilisateur:</strong> {analysis.document.utilisateur}
            </p>
            <p>
              <strong>Pages:</strong> {analysis.metadata.nombre_pages}
            </p>
            <p>
              <strong>Longueur du texte:</strong> {analysis.metadata.longueur_texte} caractères
            </p>
          </div>

          <div className="analysis-section">
            <h4>📝 Résumé</h4>
            <p className="resume">{analysis.analyse.resume}</p>
          </div>

          <div className="analysis-section">
            <h4>🔑 Points clés</h4>
            <ul className="points-list">
              {analysis.analyse.points_cles.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="analysis-section">
            <h4>💡 Suggestions d'actions</h4>
            <ul className="actions-list">
              {analysis.analyse.suggestions_actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>

          {analysis.analyse.texte_complet_ia && (
            <div className="analysis-section">
              <h4>🤖 Analyse complète IA</h4>
              <div className="ai-text">
                <pre>{analysis.analyse.texte_complet_ia}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentAnalysis
