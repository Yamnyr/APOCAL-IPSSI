const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const documentsController = require("../controllers/documentsController");

// Stockage temporaire local
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
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
