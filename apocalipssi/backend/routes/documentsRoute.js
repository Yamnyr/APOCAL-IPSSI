const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

console.log("📋 Initialisation des routes documents...")

const router = express.Router()

// Vérification du contrôleur
let documentsController
try {
  documentsController = require("../controllers/documentsController")
  console.log("✅ Contrôleur documents chargé")
} catch (error) {
  console.error("❌ Erreur chargement contrôleur:", error.message)
  // Contrôleur de fallback
  documentsController = {
    uploadDocument: (req, res) => res.status(500).json({ error: "Contrôleur non disponible" }),
    getAllDocuments: (req, res) => res.status(500).json({ error: "Contrôleur non disponible" }),
    downloadDocument: (req, res) => res.status(500).json({ error: "Contrôleur non disponible" }),
    deleteDocument: (req, res) => res.status(500).json({ error: "Contrôleur non disponible" }),
    analyzeDocument: (req, res) => res.status(500).json({ error: "Contrôleur non disponible" }),
  }
}

// Créer le dossier uploads
const uploadsDir = "uploads/"
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
    console.log("📁 Dossier uploads créé")
  }
} catch (error) {
  console.error("❌ Erreur création dossier uploads:", error)
}

// Configuration Multer sécurisée
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    if (extname) {
      cb(null, true)
    } else {
      cb(new Error("Type de fichier non autorisé"))
    }
  },
})

// Routes définies UNE PAR UNE avec logs
console.log("🔧 Définition des routes...")

// Route POST upload
try {
  router.post("/upload", upload.single("pdf"), (req, res, next) => {
    console.log("📤 Route POST /upload appelée")
    documentsController.uploadDocument(req, res, next)
  })
  console.log("✅ Route POST /upload définie")
} catch (error) {
  console.error("❌ Erreur route POST /upload:", error)
}

// Route GET liste
try {
  router.get("/", (req, res, next) => {
    console.log("📋 Route GET / appelée")
    documentsController.getAllDocuments(req, res, next)
  })
  console.log("✅ Route GET / définie")
} catch (error) {
  console.error("❌ Erreur route GET /:", error)
}

// Route GET download - ATTENTION AUX PARAMÈTRES
try {
  router.get("/download/:fileId", (req, res, next) => {
    console.log("⬇️ Route GET /download/:fileId appelée avec:", req.params.fileId)
    // Validation du paramètre
    if (!req.params.fileId || req.params.fileId.trim() === "") {
      return res.status(400).json({ error: "ID de fichier manquant" })
    }
    documentsController.downloadDocument(req, res, next)
  })
  console.log("✅ Route GET /download/:fileId définie")
} catch (error) {
  console.error("❌ Erreur route GET /download/:fileId:", error)
}

// Route DELETE - ATTENTION AUX PARAMÈTRES
try {
  router.delete("/:id", (req, res, next) => {
    console.log("🗑️ Route DELETE /:id appelée avec:", req.params.id)
    // Validation du paramètre
    if (!req.params.id || req.params.id.trim() === "") {
      return res.status(400).json({ error: "ID manquant" })
    }
    documentsController.deleteDocument(req, res, next)
  })
  console.log("✅ Route DELETE /:id définie")
} catch (error) {
  console.error("❌ Erreur route DELETE /:id:", error)
}

// Route GET analyze - ATTENTION AUX PARAMÈTRES
try {
  router.get("/analyze/:id", (req, res, next) => {
    console.log("🤖 Route GET /analyze/:id appelée avec:", req.params.id)
    // Validation du paramètre
    if (!req.params.id || req.params.id.trim() === "") {
      return res.status(400).json({ error: "ID manquant" })
    }
    documentsController.analyzeDocument(req, res, next)
  })
  console.log("✅ Route GET /analyze/:id définie")
} catch (error) {
  console.error("❌ Erreur route GET /analyze/:id:", error)
}

// Route de test
router.get("/test", (req, res) => {
  console.log("🧪 Route de test appelée")
  res.json({
    message: "✅ Routes documents fonctionnelles",
    routes: [
      "POST /upload",
      "GET /",
      "GET /download/:fileId", 
      "DELETE /:id",
      "GET /analyze/:id"
    ],
    timestamp: new Date()
  })
})

console.log("🎉 Routes documents initialisées avec succès")

module.exports = router