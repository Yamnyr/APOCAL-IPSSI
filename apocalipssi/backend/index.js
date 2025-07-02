require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

console.log("🚀 Démarrage serveur...")

const app = express()

// ✅ CORS CONFIGURATION COMPLÈTE - EN PREMIER !
console.log("🔧 Configuration CORS complète...")

// Configuration CORS détaillée
const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (comme Postman) et localhost
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ]

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log("❌ Origin bloquée:", origin)
      callback(new Error("Non autorisé par CORS"))
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "X-HTTP-Method-Override",
  ],
  credentials: true,
  optionsSuccessStatus: 200, // Pour les anciens navigateurs
  preflightContinue: false,
}

// Appliquer CORS
app.use(cors(corsOptions))

// Middleware spécial pour les requêtes preflight OPTIONS
app.options("*", (req, res) => {
  console.log("🔄 Requête OPTIONS (preflight) reçue pour:", req.path)
  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("Access-Control-Allow-Credentials", "true")
  res.sendStatus(200)
})

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - Origin: ${req.get("Origin") || "none"}`)

  // Forcer les headers CORS sur toutes les réponses
  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.header("Access-Control-Allow-Credentials", "true")

  next()
})

console.log("✅ CORS configuré")

// 2. Middlewares de parsing
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
console.log("✅ Middlewares configurés")

// 3. Route de test
app.get("/", (req, res) => {
  console.log("📍 Route racine appelée")
  res.json({
    message: "🚀 API Apocalipssi",
    status: "✅ En ligne",
    cors: "✅ Configuré",
    timestamp: new Date().toISOString(),
  })
})

// 4. Route de test CORS spécifique
app.get("/test-cors", (req, res) => {
  console.log("🧪 Test CORS appelé")
  res.json({
    message: "✅ CORS fonctionne !",
    origin: req.get("Origin"),
    headers: req.headers,
  })
})

// 5. Connexion MongoDB
console.log("📡 Connexion MongoDB...")
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ MongoDB connecté")

    // GridFS
    const GridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "documents",
    })
    app.locals.gfs = GridFSBucket
    console.log("🟢 GridFS initialisé")
  } catch (error) {
    console.error("❌ Erreur MongoDB:", error.message)
  }
}

connectDB()

// 6. Routes documents
console.log("📋 Chargement routes documents...")
try {
  const documentsRoute = require("./routes/documentsRoute")
  app.use("/documents", documentsRoute)
  console.log("✅ Routes documents chargées")
} catch (error) {
  console.error("❌ Erreur routes documents:", error.message)

  // Route de fallback pour upload
  app.post("/documents/upload", (req, res) => {
    console.log("📤 Route upload fallback appelée")
    res.status(500).json({
      error: "Route upload non disponible",
      message: error.message,
    })
  })
}

// 7. Gestion d'erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur:", err.message)
  res.status(500).json({ error: err.message })
})

// 8. Route 404
app.use("*", (req, res) => {
  console.log("❓ Route non trouvée:", req.originalUrl)
  res.status(404).json({
    error: "Route non trouvée",
    path: req.originalUrl,
  })
})

// 9. Démarrage serveur
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🎉 Serveur démarré sur http://localhost:${PORT}`)
  console.log(`🔧 CORS configuré pour http://localhost:5173`)
  console.log(`🧪 Test CORS: http://localhost:${PORT}/test-cors`)
  console.log(`📡 Routes disponibles:`)
  console.log(`   GET  / (test général)`)
  console.log(`   GET  /test-cors (test CORS)`)
  console.log(`   POST /documents/upload`)
})
