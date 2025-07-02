"use client"

import { useState } from "react"

const UploadForm = () => {
  const [file, setFile] = useState(null)
  const [username, setUsername] = useState("")
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  // Test CORS avant upload
  const testCors = async () => {
    try {
      console.log("🧪 Test CORS...")
      const response = await fetch("http://localhost:5000/test-cors", {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ CORS OK:", data)
        setMessage("✅ CORS fonctionne !")
      } else {
        console.log("❌ CORS KO:", response.status)
        setMessage("❌ CORS ne fonctionne pas")
      }
    } catch (error) {
      console.error("❌ Erreur test CORS:", error)
      setMessage(`❌ Erreur CORS: ${error.message}`)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setMessage("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setMessage("Veuillez sélectionner un fichier")
      return
    }

    setUploading(true)
    setMessage("")

    try {
      const formData = new FormData()
      formData.append("pdf", file)
      formData.append("username", username || "anonyme")

      console.log("📤 Envoi du fichier:", file.name)
      console.log("🔧 URL:", "http://localhost:5000/documents/upload")

      const response = await fetch("http://localhost:5000/documents/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // Important pour CORS
        // Ne pas définir Content-Type, laissez le navigateur le faire
      })

      console.log("📡 Réponse reçue:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Réponse d'erreur:", errorText)
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("✅ Upload réussi:", result)

      setMessage(`✅ Fichier "${file.name}" uploadé avec succès!`)
      setFile(null)
      setUsername("")
      e.target.reset()
    } catch (error) {
      console.error("❌ Erreur upload:", error)
      setMessage(`❌ Erreur: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>📤 Upload de Document</h2>

      {/* Bouton test CORS */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testCors}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🧪 Tester CORS
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Nom d'utilisateur (optionnel):</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Votre nom..."
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Fichier PDF:</label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            accept=".pdf,.doc,.docx,.txt"
            style={{ width: "100%", marginTop: "5px" }}
          />
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          style={{
            padding: "10px 20px",
            backgroundColor: uploading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: uploading ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          {uploading ? "📤 Upload en cours..." : "📤 Uploader"}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            borderRadius: "4px",
            backgroundColor: message.includes("❌") ? "#f8d7da" : "#d4edda",
            color: message.includes("❌") ? "#721c24" : "#155724",
            border: `1px solid ${message.includes("❌") ? "#f5c6cb" : "#c3e6cb"}`,
          }}
        >
          {message}
        </div>
      )}
    </div>
  )
}

export default UploadForm
