require("dotenv").config();
const express = require("express");
const connectDB = require("./models/connection");

const app = express();
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API en ligne 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
