# 📄 API Node.js - Gestion & Analyse de Documents PDF

Une API Express qui permet :

- 📤 l'upload de documents PDF
- 📥 leur téléchargement
- ❌ leur suppression
- 📋 la récupération de tous les documents
- 🤖 leur analyse avec une IA (Hugging Face)

## 🚀 Stack technique

- **Node.js + Express**
- **MongoDB** + GridFS pour le stockage des fichiers
- **Multer** pour l'upload local temporaire
- **pdf-parse** pour extraire le texte des PDF
- **Hugging Face** (Mistral 7B) pour l'analyse IA

---

## 📦 Installation

1. **Cloner le projet**

   ```bash
   git clone https://github.com/ton-pseudo/mon-projet.git
   cd mon-projet
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Copier le fichier `.env.example`**

   ```bash
   cp .env.example .env
   ```

   Puis, remplissez les variables avec vos informations :

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ton-db
   HUGGINGFACE_API_KEY=ton-api-key
   ```

4. **Lancer le serveur**
   ```bash
   npm start
   ```

---

## 🔌 Endpoints

### 📤 POST `/documents/upload`

Upload un fichier PDF.

- **Body (multipart/form-data)** :

  - `pdf`: fichier PDF
  - `username`: nom d'utilisateur

- ✅ Réponse :

```json
{
  "message": "Fichier uploadé avec succès",
  "document": {
    "_id": "...",
    "username": "John",
    "fileId": "...",
    "originalName": "cv.pdf",
    "uploadDate": "..."
  }
}
```

---

### 📋 GET `/documents`

Retourne tous les documents.

- ✅ Réponse :

```json
[
  {
    "_id": "...",
    "username": "John",
    "fileId": "...",
    "originalName": "cv.pdf",
    "uploadDate": "..."
  }
]
```

---

### 📥 GET `/documents/download/:fileId`

Télécharge un fichier PDF par son `fileId`.

---

### ❌ DELETE `/documents/:id`

Supprime un document et son fichier associé.

---

### 🤖 GET `/documents/analyze/:id`

Analyse le contenu texte du document via Hugging Face (Mistral 7B) et retourne :

- un résumé
- des points clés
- des suggestions d'action

- ✅ Réponse :

```json
{
  "document": {
    "id": "...",
    "nom_original": "rapport.pdf",
    "utilisateur": "Alice",
    "date_upload": "..."
  },
  "analyse": {
    "resume": "...",
    "points_cles": ["...", "..."],
    "suggestions_actions": ["...", "..."]
  },
  "metadata": {
    "nombre_pages": 5,
    "longueur_texte": 3049,
    "date_analyse": "..."
  }
}
```

---

## 📁 Structure du projet

```
.
├── controllers/
│   └── documentsController.js
├── models/
│   ├── connection.js
│   └── documentsModel.js
├── routes/
│   └── documentsRoute.js
├── uploads/ (temporaire)
├── index.js
├── .env
└── README.md
```

---

## ✅ TODO / Améliorations possibles

- [ ] Ajout d'une authentification JWT
- [ ] Ajout de rôles utilisateurs
- [ ] Historique des analyses par utilisateur
- [ ] Support multi-langue (fr/en)
- [ ] Ajout d'une interface front

---

## 🧠 Crédits

- Analyse IA : [Mistral 7B Instruct v0.3](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3)
- PDF Parsing : [pdf-parse](https://www.npmjs.com/package/pdf-parse)
