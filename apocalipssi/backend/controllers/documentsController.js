const mongoose = require("mongoose");
const fs = require("fs");
const Document = require("../models/documentsModel");

// 📤 Upload
exports.uploadDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });

  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "documents",
    });

    const uploadStream = bucket.openUploadStream(req.file.originalname);
    const fileStream = fs.createReadStream(req.file.path);

    fileStream
      .pipe(uploadStream)
      .on("error", (err) => {
        return res
          .status(500)
          .json({ message: "Erreur lors de l'upload", error: err.message });
      })
      .on("finish", async () => {
        // Supprimer fichier temporaire
        fs.unlinkSync(req.file.path);

        const doc = new Document({
          username: req.body.username,
          fileId: uploadStream.id,
          originalName: req.file.originalname,
        });

        await doc.save();

        res
          .status(201)
          .json({ message: "Fichier uploadé avec succès", document: doc });
      });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 📋 Liste
exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Téléchargement
exports.downloadDocument = async (req, res) => {
  const gfs = req.app.locals.gfs;
  if (!gfs) return res.status(500).json({ message: "GridFS non initialisé" });

  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const filesCursor = await gfs.find({ _id: fileId });
    const files = await filesCursor.toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "Fichier introuvable" });
    }
    const file = files[0];

    res.set("Content-Type", file.contentType || "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`);

    const downloadStream = gfs.openDownloadStream(file._id);
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Suppression
exports.deleteDocument = async (req, res) => {
  const gfs = req.app.locals.gfs;
  if (!gfs) return res.status(500).json({ message: "GridFS non initialisé" });

  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document non trouvé" });

    await gfs.delete(doc.fileId); // delete remplace remove dans les versions récentes
    await doc.deleteOne();
    res.json({ message: "Document et fichier supprimés avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
