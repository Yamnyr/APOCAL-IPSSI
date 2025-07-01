"use client"

import { useState } from "react"
import "../App.css"

const UploadForm = () => {
  const [name, setName] = useState("")
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
      setFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    setMessage("")

    try {
      const formData = new FormData()
      formData.append("username", name)
      formData.append("pdf", file)

      const response = await fetch("http://localhost:5000/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setMessage("✅ Fichier uploadé avec succès !")

      // Reset form
      setName("")
      setFile(null)
      setFileName("")
      document.getElementById("pdf-upload").value = ""
    } catch (error) {
      setMessage(`❌ Erreur lors de l'upload: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-form-container">
      <h2>Formulaire de téléchargement</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="name">Nom:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Entrez votre nom"
            required
            className="form-control"
            disabled={uploading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pdf-upload">Fichier PDF:</label>
          <div className="file-input-container">
            <input
              type="file"
              id="pdf-upload"
              accept=".pdf"
              onChange={handleFileChange}
              required
              className="file-input"
              disabled={uploading}
            />
            {fileName && <p className="file-name">Fichier sélectionné: {fileName}</p>}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={uploading}>
          {uploading ? "Upload en cours..." : "Envoyer"}
        </button>

        {message && <div className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</div>}
      </form>
    </div>
  )
}

export default UploadForm
