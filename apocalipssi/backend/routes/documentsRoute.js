const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const documentsController = require("../controllers/documentsController");

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = "uploads/";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Dossier uploads créé");
}

// Stockage temporaire local
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post(
  "/upload",
  upload.single("pdf"),
  documentsController.uploadDocument
);
router.get("/", documentsController.getAllDocuments);
router.get("/download/:fileId", documentsController.downloadDocument);
router.delete("/:id", documentsController.deleteDocument);

module.exports = router;