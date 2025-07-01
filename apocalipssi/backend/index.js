require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const connectDB = require("./models/connection")
const cors = require("cors")
const app = express()
app.use(express.json())

app.use(cors())
connectDB()

app.use(cors({
  origin: 'http://localhost:5173',  // autorise uniquement ce front
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}))



const conn = mongoose.connection
conn.once("open", () => {
  const GridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "documents",
  })
  app.locals.gfs = GridFSBucket
  console.log("🟢 GridFSBucket initialisé")
})

const documentsRoute = require("./routes/documentsRoute")
app.use("/documents", documentsRoute)

app.get("/", (req, res) => res.send("API en ligne 🚀"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`))
