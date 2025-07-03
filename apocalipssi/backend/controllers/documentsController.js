const mongoose = require("mongoose")
const fs = require("fs")
const Document = require("../models/documentsModel")
const pdf = require("pdf-parse")

// Fonction utilitaire pour télécharger le modèle si nécessaire
const ensureModelExists = async (modelName = "llama3.2:1b") => {
  try {
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434"

    // Vérifier si le modèle existe
    const listResponse = await fetch(`${ollamaUrl}/api/tags`)
    if (listResponse.ok) {
      const models = await listResponse.json()
      const modelExists = models.models?.some((model) => model.name === modelName)

      if (!modelExists) {
        console.log(`📥 Téléchargement du modèle ${modelName}...`)

        // Télécharger le modèle
        const pullResponse = await fetch(`${ollamaUrl}/api/pull`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: modelName }),
        })

        if (!pullResponse.ok) {
          throw new Error(`Erreur lors du téléchargement du modèle: ${pullResponse.status}`)
        }

        console.log(`✅ Modèle ${modelName} téléchargé avec succès`)
      }
    }
  } catch (error) {
    console.warn(`⚠️ Impossible de vérifier/télécharger le modèle: ${error.message}`)
  }
}

// Fonction pour nettoyer et parser le JSON de l'IA - Version améliorée
const parseAIResponse = (responseText) => {
  try {
    console.log("🤖 Réponse brute complète:", responseText)

    // Nettoyer la réponse
    let cleanedText = responseText.trim()

    // Enlever les balises markdown si présentes
    cleanedText = cleanedText.replace(/```json\s*/g, "").replace(/```\s*/g, "")

    // Chercher le JSON dans la réponse (plusieurs patterns)
    let jsonMatch = cleanedText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      // Essayer de trouver un JSON sur plusieurs lignes
      jsonMatch = cleanedText.match(/\{[^}]*"resume"[^}]*\}/s)
    }

    if (jsonMatch) {
      const jsonString = jsonMatch[0]
      console.log("🔍 JSON extrait:", jsonString)

      // Parser le JSON
      const parsed = JSON.parse(jsonString)

      // Vérifier que les clés requises existent
      if (parsed.resume && parsed.points_cles && parsed.suggestions_actions) {
        console.log("✅ JSON valide trouvé")

        // Vérifier si le modèle a simplement répété le template
        const isTemplateRepeat =
            parsed.resume.includes("Un résumé concis du document") &&
            parsed.points_cles.some((p) => p.includes("point clé important du document")) &&
            parsed.suggestions_actions.some((a) => a.includes("action recommandée"))

        if (isTemplateRepeat) {
          console.log("⚠️ Le modèle a répété le template au lieu de l'analyser")
          return {
            success: false,
            rawText: responseText,
            error: "Le modèle a répété le template",
          }
        }

        return {
          success: true,
          data: parsed,
        }
      } else {
        console.log("❌ JSON incomplet, clés manquantes")
      }
    }

    // Si pas de JSON trouvé, essayer de créer un JSON à partir du texte brut
    console.log("🔄 Tentative de création de JSON à partir du texte brut")

    const lines = cleanedText.split("\n").filter((line) => line.trim())
    let resume = ""
    const points = []
    const actions = []

    // Essayer d'extraire des informations du texte brut
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.length > 20 && !resume) {
        resume = line.substring(0, 200) + (line.length > 200 ? "..." : "")
      }
      if (line.includes("•") || line.includes("-") || line.includes("*")) {
        if (points.length < 4) {
          points.push(line.replace(/[•\-*]\s*/, "").trim())
        }
      }
    }

    // Fallback avec contenu extrait
    if (resume || points.length > 0) {
      return {
        success: true,
        data: {
          resume: resume || "Résumé du document analysé par l'IA locale",
          points_cles:
              points.length > 0
                  ? points
                  : [
                    "Document PDF traité avec succès",
                    "Contenu extrait et analysé",
                    "Informations disponibles pour consultation",
                    "Prêt pour traitement manuel",
                  ],
          suggestions_actions: [
            "Consulter le contenu extrait",
            "Réviser les informations manuellement",
            "Organiser selon vos besoins",
          ],
        },
        extracted_from_raw: true,
      }
    }

    return {
      success: false,
      rawText: responseText,
    }
  } catch (error) {
    console.error("❌ Erreur parsing JSON:", error)
    return {
      success: false,
      rawText: responseText,
      error: error.message,
    }
  }
}

// Fonction pour générer une analyse basique à partir du texte du PDF
const generateBasicAnalysis = (text) => {
  try {
    // Extraire les premières phrases pour le résumé
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10)
    const firstSentences = sentences.slice(0, 2).join(". ").trim() + "."

    // Extraire des mots-clés potentiels (mots qui apparaissent fréquemment)
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 4)

    const wordFrequency = {}
    words.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1
    })

    // Trier par fréquence et prendre les 5 premiers
    const keywords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map((entry) => entry[0])

    // Extraire des paragraphes potentiellement importants (plus longs)
    const paragraphs = text
        .split("\n\n")
        .filter((p) => p.trim().length > 50)
        .sort((a, b) => b.length - a.length)

    // Créer des points clés à partir des mots-clés et paragraphes
    const points_cles = [
      `Le document contient des références à "${keywords.slice(0, 2).join('" et "')}"`,
      `Un sujet important semble être lié à "${keywords[2] || keywords[0]}"`,
      `Le document comporte ${paragraphs.length} paragraphes principaux`,
      `Longueur totale: ${text.length} caractères (environ ${Math.round(text.length / 6)} mots)`,
    ]

    // Suggestions d'actions basées sur le contenu - Maintenant des questions pour le chat
    const suggestions_actions = [
      "Peux-tu me donner plus de détails sur " + (keywords[0] || "le sujet principal") + " ?",
      "Quels sont les points les plus importants à retenir de ce document ?",
      "Y a-t-il des actions concrètes recommandées dans ce document ?",
    ]

    return {
      resume: firstSentences,
      points_cles,
      suggestions_actions,
      texte_extrait_pdf: text.substring(0, 1000) + (text.length > 1000 ? "..." : ""),
      note_generation: "Analyse générée automatiquement à partir du contenu du document",
    }
  } catch (error) {
    console.error("Erreur lors de la génération de l'analyse basique:", error)
    return {
      resume: "Document PDF analysé avec succès. Contenu disponible pour consultation.",
      points_cles: [
        "Document PDF traité avec succès",
        `Contient ${text.length} caractères de texte`,
        "Prêt pour analyse manuelle",
        "Contenu extrait et disponible",
      ],
      suggestions_actions: [
        "Peux-tu résumer les points principaux de ce document ?",
        "Quelles sont les informations les plus importantes ?",
        "Comment puis-je utiliser ces informations ?",
      ],
      texte_extrait_pdf: text.substring(0, 1000) + (text.length > 1000 ? "..." : ""),
    }
  }
}

// 📤 Upload
exports.uploadDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" })

  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "documents",
    })

    const uploadStream = bucket.openUploadStream(req.file.originalname)
    const fileStream = fs.createReadStream(req.file.path)

    fileStream
        .pipe(uploadStream)
        .on("error", (err) => {
          return res.status(500).json({ message: "Erreur lors de l'upload", error: err.message })
        })
        .on("finish", async () => {
          // Supprimer fichier temporaire
          fs.unlinkSync(req.file.path)

          const doc = new Document({
            username: req.body.username,
            fileId: uploadStream.id,
            originalName: req.file.originalname,
          })

          await doc.save()

          res.status(201).json({ message: "Fichier uploadé avec succès", document: doc })
        })
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message })
  }
}

// 📋 Liste
exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find()
    res.json(docs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Téléchargement
exports.downloadDocument = async (req, res) => {
  const gfs = req.app.locals.gfs
  if (!gfs) return res.status(500).json({ message: "GridFS non initialisé" })

  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId)
    const filesCursor = await gfs.find({ _id: fileId })
    const files = await filesCursor.toArray()
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "Fichier introuvable" })
    }
    const file = files[0]

    res.set("Content-Type", file.contentType || "application/octet-stream")
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`)

    const downloadStream = gfs.openDownloadStream(file._id)
    downloadStream.pipe(res)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Suppression
exports.deleteDocument = async (req, res) => {
  const gfs = req.app.locals.gfs
  if (!gfs) return res.status(500).json({ message: "GridFS non initialisé" })

  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: "Document non trouvé" })

    await gfs.delete(doc.fileId)
    await doc.deleteOne()
    res.json({ message: "Document et fichier supprimés avec succès" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 🤖 Analyse IA avec modèle local (Ollama)
exports.analyzeDocument = async (req, res) => {
  const gfs = req.app.locals.gfs
  if (!gfs) return res.status(500).json({ message: "GridFS non initialisé" })

  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: "Document non trouvé" })

    // Télécharger le fichier depuis GridFS
    const downloadStream = gfs.openDownloadStream(doc.fileId)
    const chunks = []

    downloadStream.on("data", (chunk) => chunks.push(chunk))
    downloadStream.on("error", (err) => {
      return res.status(500).json({ message: "Erreur lors du téléchargement", error: err.message })
    })

    downloadStream.on("end", async () => {
      try {
        const buffer = Buffer.concat(chunks)

        // Extraire le texte du PDF
        const pdfData = await pdf(buffer)
        const text = pdfData.text

        if (!text || text.trim().length === 0) {
          return res.status(400).json({ message: "Impossible d'extraire le texte du PDF" })
        }

        // Générer une analyse basique à partir du texte du PDF
        const basicAnalysis = generateBasicAnalysis(text)

        try {
          // S'assurer que le modèle existe
          await ensureModelExists("llama3.2:1b")

          // Préparer le prompt pour l'IA locale - Version améliorée
          const prompt = `Tu es un assistant IA spécialisé dans l'analyse de documents. 
  
IMPORTANT: Analyse le document suivant et réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après.

Voici le document à analyser :
${text.substring(0, 2000)}

Génère un JSON avec cette structure exacte, en remplaçant les exemples par ton analyse réelle du document:

{
  "resume": "Écris ici un résumé concis du document en 2-3 phrases",
  "points_cles": [
    "Premier point important que tu as identifié dans le document",
    "Deuxième point important que tu as identifié dans le document", 
    "Troisième point important que tu as identifié dans le document",
    "Quatrième point important que tu as identifié dans le document"
  ],
  "suggestions_actions": [
    "Première question que l'utilisateur pourrait poser sur ce document",
    "Deuxième question que l'utilisateur pourrait poser sur ce document",
    "Troisième question que l'utilisateur pourrait poser sur ce document"
  ]
}

REMPLACE les exemples ci-dessus par ton analyse réelle du document. Les suggestions_actions doivent être des questions que l'utilisateur pourrait poser.`

          const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434"

          console.log("🤖 Envoi de la requête à Ollama...")

          // Appel à Ollama (modèle local)
          const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama3.2:1b",
              prompt: prompt,
              stream: false,
              options: {
                temperature: 0.3,
                top_p: 0.8,
                num_predict: 600,
                stop: ["\n\n", "```"],
              },
            }),
          })

          if (!response.ok) {
            throw new Error(`Erreur Ollama: ${response.status} - ${response.statusText}`)
          }

          const aiResponse = await response.json()
          const analysisText = aiResponse.response || ""

          console.log("🤖 Réponse brute de l'IA:", analysisText)

          // Parser la réponse de l'IA
          const parseResult = parseAIResponse(analysisText)

          if (parseResult.success) {
            console.log("✅ Analyse IA réussie:", parseResult.data)

            // Utiliser l'analyse de l'IA
            res.json({
              document: {
                id: doc._id,
                nom_original: doc.originalName,
                utilisateur: doc.username,
                date_upload: doc.uploadDate,
              },
              analyse: parseResult.data,
              texte_document: text, // Ajouter le texte complet pour le chat
              metadata: {
                nombre_pages: pdfData.numpages,
                longueur_texte: text.length,
                date_analyse: new Date(),
                modele_utilise: "llama3.2:1b (local)",
                parsing_success: true,
              },
            })
          } else {
            console.log("⚠️ Échec de l'analyse IA, utilisation de l'analyse basique")

            // Utiliser l'analyse basique générée à partir du texte
            res.json({
              document: {
                id: doc._id,
                nom_original: doc.originalName,
                utilisateur: doc.username,
                date_upload: doc.uploadDate,
              },
              analyse: {
                ...basicAnalysis,
                texte_complet_ia: parseResult.rawText,
                erreur_parsing: parseResult.error || "Format JSON non reconnu",
              },
              texte_document: text, // Ajouter le texte complet pour le chat
              metadata: {
                nombre_pages: pdfData.numpages,
                longueur_texte: text.length,
                date_analyse: new Date(),
                modele_utilise: "llama3.2:1b (local) + analyse automatique",
                parsing_success: false,
              },
            })
          }
        } catch (aiError) {
          console.error("Erreur lors de l'analyse IA:", aiError)

          // En cas d'erreur avec l'IA, utiliser directement l'analyse basique
          res.json({
            document: {
              id: doc._id,
              nom_original: doc.originalName,
              utilisateur: doc.username,
              date_upload: doc.uploadDate,
            },
            analyse: {
              ...basicAnalysis,
              erreur_ia: aiError.message,
            },
            texte_document: text, // Ajouter le texte complet pour le chat
            metadata: {
              nombre_pages: pdfData.numpages,
              longueur_texte: text.length,
              date_analyse: new Date(),
              modele_utilise: "Analyse automatique (erreur IA)",
              parsing_success: false,
            },
          })
        }
      } catch (error) {
        console.error("Erreur lors de l'analyse:", error)

        // Fallback en cas d'erreur générale
        res.json({
          document: {
            id: doc._id,
            nom_original: doc.originalName,
            utilisateur: doc.username,
            date_upload: doc.uploadDate,
          },
          analyse: {
            resume:
                "Erreur lors de l'analyse automatique. Le document a été traité avec succès mais l'analyse n'est pas disponible.",
            points_cles: ["Document PDF traité", "Texte extrait avec succès", "Analyse temporairement indisponible"],
            suggestions_actions: [
              "Peux-tu m'aider à comprendre ce document ?",
              "Quelles sont les informations principales ?",
              "Comment puis-je utiliser ce document ?",
            ],
            erreur_ia: error.message,
          },
          metadata: {
            nombre_pages: 0,
            longueur_texte: 0,
            date_analyse: new Date(),
            modele_utilise: "Fallback (erreur système)",
          },
        })
      }
    })
  } catch (err) {
    console.error("Erreur générale:", err)
    res.status(500).json({ message: "Erreur serveur", error: err.message })
  }
}

// 💬 Chat avec l'IA sur un document
exports.chatWithDocument = async (req, res) => {
  try {
    const { message, documentText, conversationHistory } = req.body

    if (!message) {
      return res.status(400).json({ message: "Message requis" })
    }

    // S'assurer que le modèle existe
    await ensureModelExists("llama3.2:1b")

    // Construire le contexte de conversation
    let conversationContext = ""
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = conversationHistory
          .map((msg) => `${msg.role === "user" ? "Utilisateur" : "Assistant"}: ${msg.content}`)
          .join("\n")
    }

    // Préparer le prompt pour le chat
    const prompt = `Tu es un assistant IA spécialisé dans l'analyse de documents. Tu discutes avec un utilisateur à propos d'un document spécifique.

CONTEXTE DU DOCUMENT:
${documentText ? documentText.substring(0, 3000) : "Document non disponible"}

${conversationContext ? `HISTORIQUE DE CONVERSATION:\n${conversationContext}\n` : ""}

NOUVELLE QUESTION DE L'UTILISATEUR:
${message}

Réponds de manière naturelle et utile en te basant sur le contenu du document. Sois concis mais informatif.`

    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434"

    console.log("💬 Envoi de la question à l'IA:", message)

    // Appel à Ollama pour le chat
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.4,
          top_p: 0.9,
          num_predict: 400,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur Ollama: ${response.status} - ${response.statusText}`)
    }

    const aiResponse = await response.json()
    const aiMessage = aiResponse.response || "Désolé, je n'ai pas pu générer une réponse."

    console.log("💬 Réponse de l'IA:", aiMessage)

    res.json({
      response: aiMessage.trim(),
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("Erreur lors du chat:", error)
    res.status(500).json({
      message: "Erreur lors de la génération de la réponse",
      error: error.message,
    })
  }
}
