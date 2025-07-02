const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Créer un utilisateur
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérification de l'existence de l'utilisateur
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    // Création de l'utilisateur
    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({ message: "Utilisateur créé", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Connexion de l'utilisateur
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification de l'existence de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    // Vérification du mot de passe
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Création du token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Connexion réussie",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// Mise à jour du profil utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { username, email } = req.body;

    // Mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(userId, { username, email }, { new: true });

    res.status(200).json({ message: "Profil mis à jour", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
