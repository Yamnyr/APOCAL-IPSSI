"use client"

import React, { useState } from "react"

const DocumentAnalysis = ({ documentId, onClose }) => {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const analyzeDocument = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:5000/documents/analyze/${documentId}`)

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Données reçues:", data) // Debug
      setAnalysis(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (message) => {
    if (!message.trim() || chatLoading) return

    const userMessage = { role: "user", content: message, timestamp: new Date() }
    setChatMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setChatLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/documents/chat/${documentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          documentText: analysis?.texte_document,
          conversationHistory: chatMessages,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const aiMessage = { role: "assistant", content: data.response, timestamp: new Date() }
      setChatMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      const errorMessage = {
        role: "assistant",
        content: `Désolé, une erreur s'est produite: ${err.message}`,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setChatLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setShowChat(true)
    sendMessage(suggestion)
  }

  const handleSubmitMessage = (e) => {
    e.preventDefault()
    sendMessage(currentMessage)
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
              <p>Analyse du document par IA locale...</p>
              <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.5rem" }}>
                Cela peut prendre quelques secondes...
              </p>
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
        <div className="analysis-content" style={{ maxWidth: showChat ? "1000px" : "800px" }}>
          <div className="analysis-header">
            <h3>📊 Analyse IA - {analysis.document.nom_original}</h3>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                  onClick={() => setShowChat(!showChat)}
                  style={{
                    background: showChat ? "#10b981" : "#6366f1",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
              >
                {showChat ? "📊 Analyse" : "💬 Chat"}
              </button>
              <button onClick={onClose} className="close-button">
                ×
              </button>
            </div>
          </div>

          <div className="analysis-body" style={{ display: "flex", gap: "1rem" }}>
            {/* Section Analyse */}
            <div style={{ flex: showChat ? "1" : "1", minWidth: "0" }}>
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
                <p>
                  <strong>Modèle:</strong> {analysis.metadata.modele_utilise}
                </p>
                {analysis.metadata.parsing_success !== undefined && (
                    <p>
                      <strong>Parsing JSON:</strong>
                      <span
                          style={{
                            color: analysis.metadata.parsing_success ? "#10b981" : "#ef4444",
                            marginLeft: "0.5rem",
                          }}
                      >
                    {analysis.metadata.parsing_success ? "✅ Réussi" : "❌ Échec"}
                  </span>
                    </p>
                )}
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
                <h4>💡 Questions suggérées</h4>
                <ul className="actions-list">
                  {analysis.analyse.suggestions_actions.map((action, index) => (
                      <li
                          key={index}
                          onClick={() => handleSuggestionClick(action)}
                          style={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            borderLeft: "4px solid #6366f1",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f0f9ff"
                            e.target.style.borderLeftColor = "#3b82f6"
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "white"
                            e.target.style.borderLeftColor = "#6366f1"
                          }}
                      >
                        {action} 💬
                      </li>
                  ))}
                </ul>
              </div>

              {analysis.analyse.texte_extrait_pdf && !showChat && (
                  <div className="analysis-section">
                    <h4>📄 Extrait du document PDF</h4>
                    <div className="ai-text">
                      <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>{analysis.analyse.texte_extrait_pdf}</pre>
                    </div>
                  </div>
              )}
            </div>

            {/* Section Chat */}
            {showChat && (
                <div
                    style={{
                      flex: "1",
                      borderLeft: "1px solid #e5e7eb",
                      paddingLeft: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "500px",
                    }}
                >
                  <h4 style={{ marginTop: "0", marginBottom: "1rem", color: "#1f2937" }}>💬 Chat avec l'IA</h4>

                  {/* Messages */}
                  <div
                      style={{
                        flex: "1",
                        overflowY: "auto",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        padding: "1rem",
                        marginBottom: "1rem",
                        backgroundColor: "#f9fafb",
                        maxHeight: "400px",
                      }}
                  >
                    {chatMessages.length === 0 ? (
                        <p style={{ color: "#6b7280", textAlign: "center", fontStyle: "italic" }}>
                          Cliquez sur une question suggérée ou tapez votre message ci-dessous pour commencer la conversation.
                        </p>
                    ) : (
                        chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                  marginBottom: "1rem",
                                  padding: "0.75rem",
                                  borderRadius: "0.5rem",
                                  backgroundColor: msg.role === "user" ? "#dbeafe" : "#f0fdf4",
                                  borderLeft: `4px solid ${msg.role === "user" ? "#3b82f6" : "#10b981"}`,
                                }}
                            >
                              <div
                                  style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: msg.role === "user" ? "#1e40af" : "#166534",
                                    marginBottom: "0.25rem",
                                  }}
                              >
                                {msg.role === "user" ? "Vous" : "IA"}
                              </div>
                              <div style={{ color: "#1f2937", lineHeight: "1.5" }}>{msg.content}</div>
                            </div>
                        ))
                    )}

                    {chatLoading && (
                        <div
                            style={{
                              padding: "0.75rem",
                              borderRadius: "0.5rem",
                              backgroundColor: "#f0fdf4",
                              borderLeft: "4px solid #10b981",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                        >
                          <div className="spinner" style={{ width: "16px", height: "16px" }}></div>
                          <span style={{ color: "#166534", fontSize: "0.875rem" }}>L'IA réfléchit...</span>
                        </div>
                    )}
                  </div>

                  {/* Formulaire de message */}
                  <form onSubmit={handleSubmitMessage} style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Posez votre question sur le document..."
                        style={{
                          flex: "1",
                          padding: "0.75rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem",
                        }}
                        disabled={chatLoading}
                    />
                    <button
                        type="submit"
                        disabled={chatLoading || !currentMessage.trim()}
                        style={{
                          backgroundColor: "#6366f1",
                          color: "white",
                          border: "none",
                          padding: "0.75rem 1rem",
                          borderRadius: "0.5rem",
                          cursor: chatLoading || !currentMessage.trim() ? "not-allowed" : "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          opacity: chatLoading || !currentMessage.trim() ? 0.5 : 1,
                        }}
                    >
                      Envoyer
                    </button>
                  </form>
                </div>
            )}
          </div>
        </div>
      </div>
  )
}

export default DocumentAnalysis
