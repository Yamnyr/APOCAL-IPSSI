require("dotenv").config()
const express = require("express")

console.log("🚀 Test minimal...")

const app = express()

console.log("✅ Express créé")

// Test CORS simple
const cors = require("cors")
console.log("✅ CORS importé")

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
}))
console.log("✅ CORS configuré")

// Test route simple
app.get("/", (req, res) => {
  res.json({ message: "Test OK" })
})
console.log("✅ Route de test créée")

// NE PAS IMPORTER models/connection pour l'instant
console.log("⚠️ Pas d'import de models/connection")

const PORT = 5000
app.listen(PORT, () => {
  console.log(`🎉 Serveur test démarré sur le port ${PORT}`)
  console.log("🔍 Si ça marche, le problème vient de models/connection ou d'un autre import")
})