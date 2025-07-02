const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Importer 'protect' avant de l'utiliser dans les routes
const protect = require("../middleware/authMiddleware");

router.post("/register", userController.createUser); // Enregistrement
router.post("/login", userController.loginUser); // Connexion
router.put("/update", protect, userController.updateUser); // Mise à jour du profil

module.exports = router;
