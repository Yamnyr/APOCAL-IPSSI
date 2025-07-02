const mongoose = require("mongoose")
const fs = require("fs")
const Document = require("../models/documentsModel")
const pdf = require("pdf-parse")

// 📤 Upload - Version corrigée
exports.uploadDocument = async (req, res) => {
  console.log("📤 Début upload document")

  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier reçu" })
  }

  try {
    console.log("📄 Fichier reçu:", {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.path,
    })

    // Attendre que GridFS soit initialisé
    const gfs = req.app.locals.gfs
    if (!gfs) {
      // Nettoyer le fichier temporaire
      fs.unlinkSync(req.file.path)
      return res.status(500).json({ message: "GridFS non initialisé" })
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "documents",
    })

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
        originalName: req.file.originalname,
        username: req.body.username || "anonyme",
        uploadDate: new Date(),
      },
    })

    const fileStream = fs.createReadStream(req.file.path)

    fileStream
      .pipe(uploadStream)
      .on("error", (err) => {
        console.error("❌ Erreur upload stream:", err)
        // Nettoyer le fichier temporaire
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path)
        }
        return res.status(500).json({ message: "Erreur lors de l'upload", error: err.message })
      })
      .on("finish", async () => {
        try {
          console.log("✅ Upload vers GridFS terminé")

          // Supprimer fichier temporaire
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
            console.log("🗑️ Fichier temporaire supprimé")
          }

          // Sauvegarder les métadonnées en DB
          const doc = new Document({
            username: req.body.username || "anonyme",
            fileId: uploadStream.id,
            originalName: req.file.originalname,
            uploadDate: new Date(),
          })

          await doc.save()
          console.log("💾 Métadonnées sauvegardées en DB")

          res.status(201).json({
            message: "Fichier uploadé avec succès",
            document: doc,
            fileId: uploadStream.id,
          })
        } catch (saveError) {
          console.error("❌ Erreur sauvegarde DB:", saveError)
          res.status(500).json({ message: "Erreur sauvegarde", error: saveError.message })
        }
      })
  } catch (err) {
    console.error("❌ Erreur générale upload:", err)
    // Nettoyer le fichier temporaire en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    res.status(500).json({ message: "Erreur serveur", error: err.message })
  }
}

// 📋 Liste - Version corrigée
exports.getAllDocuments = async (req, res) => {
  try {
    console.log("📋 Récupération liste documents")
    const docs = await Document.find().sort({ uploadDate: -1 })
    console.log(`📊 ${docs.length} documents trouvés`)
    res.json(docs)
  } catch (err) {
    console.error("❌ Erreur récupération documents:", err)
    res.status(500).json({ message: err.message })
  }
}

// ⬇️ Téléchargement - Version corrigée
exports.downloadDocument = async (req, res) => {
  console.log("⬇️ Début téléchargement:", req.params.fileId)

  const gfs = req.app.locals.gfs
  if (!gfs) {
    return res.status(500).json({ message: "GridFS non initialisé" })
  }

  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId)
    console.log("🔍 Recherche fichier ID:", fileId)

    const filesCursor = await gfs.find({ _id: fileId })
    const files = await filesCursor.toArray()

    if (!files || files.length === 0) {
      console.log("❌ Fichier non trouvé")
      return res.status(404).json({ message: "Fichier introuvable" })
    }

    const file = files[0]
    console.log("✅ Fichier trouvé:", file.filename)

    res.set("Content-Type", file.contentType || "application/octet-stream")
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`)

    const downloadStream = gfs.openDownloadStream(file._id)
    downloadStream.pipe(res)

    downloadStream.on("error", (err) => {
      console.error("❌ Erreur stream téléchargement:", err)
      res.status(500).json({ message: "Erreur téléchargement" })
    })
  } catch (err) {
    console.error("❌ Erreur téléchargement:", err)
    res.status(500).json({ message: err.message })
  }
}

// 🗑️ Suppression - Version corrigée
exports.deleteDocument = async (req, res) => {
  console.log("🗑️ Début suppression:", req.params.id)

  const gfs = req.app.locals.gfs
  if (!gfs) {
    return res.status(500).json({ message: "GridFS non initialisé" })
  }

  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) {
      return res.status(404).json({ message: "Document non trouvé" })
    }

    console.log("🔍 Document trouvé, suppression du fichier GridFS...")
    await gfs.delete(doc.fileId)

    console.log("🗑️ Suppression des métadonnées DB...")
    await doc.deleteOne()

    console.log("✅ Suppression terminée")
    res.json({ message: "Document et fichier supprimés avec succès" })
  } catch (err) {
    console.error("❌ Erreur suppression:", err)
    res.status(500).json({ message: err.message })
  }
}

// 🤖 Analyse IA - Votre code existant (inchangé)
exports.analyzeDocument = async (req, res) => {
  console.log("🤖 Début analyse IA:", req.params.id)

  const gfs = req.app.locals.gfs
  if (!gfs) {
    return res.status(500).json({ message: "GridFS non initialisé" })
  }

  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) {
      return res.status(404).json({ message: "Document non trouvé" })
    }

    console.log("📄 Document trouvé, téléchargement pour analyse...")

    // Télécharger le fichier depuis GridFS
    const downloadStream = gfs.openDownloadStream(doc.fileId)
    const chunks = []

    downloadStream.on("data", (chunk) => chunks.push(chunk))

    downloadStream.on("error", (err) => {
      console.error("❌ Erreur téléchargement pour analyse:", err)
      return res.status(500).json({ message: "Erreur lors du téléchargement", error: err.message })
    })

    downloadStream.on("end", async () => {
      try {
        console.log("📖 Extraction du texte PDF...")
        const buffer = Buffer.concat(chunks)

        // Extraire le texte du PDF
        const pdfData = await pdf(buffer)
        const text = pdfData.text

        if (!text || text.trim().length === 0) {
          return res.status(400).json({ message: "Impossible d'extraire le texte du PDF" })
        }

        console.log(`📊 Texte extrait: ${text.length} caractères`)

        // Préparer le prompt pour l'IA
        const prompt = `Analyse ce document et fournis une réponse structurée en JSON avec les clés suivantes:
        - "resume": un résumé concis du document (2-3 phrases)
        - "points_cles": une liste de 3-5 points clés principaux
        - "suggestions_actions": une liste de 3-4 suggestions d'actions concrètes

        Document à analyser:
${text.substring(0, 3000)}...`

        console.log("🤖 Appel API Hugging Face...")

        // Appel à l'API Hugging Face
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
              return_full_text: false,
            },
          }),
        })

        if (!response.ok) {
          throw new Error(`Erreur API Hugging Face: ${response.status}`)
        }

        const aiResponse = await response.json()
        console.log("✅ Réponse IA reçue")

        let analysisText = ""
        if (Array.isArray(aiResponse) && aiResponse[0]?.generated_text) {
          analysisText = aiResponse[0].generated_text
        } else if (aiResponse.generated_text) {
          analysisText = aiResponse.generated_text
        } else {
          throw new Error("Format de réponse inattendu de l'API")
        }

        // Tenter de parser le JSON ou créer une structure par défaut
        let analysis
        try {
          // Chercher du JSON dans la réponse
          const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0])
          } else {
            throw new Error("Pas de JSON trouvé")
          }
        } catch (parseError) {
          console.log("⚠️ Parsing JSON échoué, structure par défaut")
          // Si le parsing JSON échoue, créer une structure par défaut
          analysis = {
            resume: "Analyse générée par IA - voir le texte complet ci-dessous",
            points_cles: ["Document analysé avec succès", "Contenu extrait du PDF", "Analyse IA disponible"],
            suggestions_actions: [
              "Réviser le contenu du document",
              "Identifier les points d'action",
              "Planifier les étapes suivantes",
            ],
            texte_complet_ia: analysisText,
          }
        }

        console.log("✅ Analyse terminée avec succès")

        res.json({
          document: {
            id: doc._id,
            nom_original: doc.originalName,
            utilisateur: doc.username,
            date_upload: doc.uploadDate,
          },
          analyse: analysis,
          metadata: {
            nombre_pages: pdfData.numpages,
            longueur_texte: text.length,
            date_analyse: new Date(),
          },
        })
      } catch (error) {
        console.error("❌ Erreur lors de l'analyse:", error)
        res.status(500).json({
          message: "Erreur lors de l'analyse du document",
          error: error.message,
        })
      }
    })
  } catch (err) {
    console.error("❌ Erreur générale analyse:", err)
    res.status(500).json({ message: "Erreur serveur", error: err.message })
  }
}
