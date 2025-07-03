# Installation et Configuration d'Ollama pour APOCALIPSSI

## Option 1: Installation locale (Recommandée pour le développement)

### 1. Installer Ollama
\`\`\`bash
# Linux/macOS
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Télécharger depuis https://ollama.com/download
\`\`\`

### 2. Démarrer Ollama
\`\`\`bash
ollama serve
\`\`\`

### 3. Télécharger le modèle léger
\`\`\`bash
# Modèle très léger (1B paramètres) - Recommandé
ollama pull llama3.2:1b

# Alternatives plus puissantes mais plus lourdes
ollama pull llama3.2:3b
ollama pull phi3:mini
ollama pull gemma2:2b
\`\`\`

### 4. Tester le modèle
\`\`\`bash
ollama run llama3.2:1b "Résume ce texte: Lorem ipsum dolor sit amet..."
\`\`\`

## Option 2: Avec Docker (Production)

Le docker-compose.yml inclut déjà le service Ollama.

\`\`\`bash
docker-compose up -d
\`\`\`

## Option 3: Alternative avec Transformers.js (Plus léger)

Si Ollama est trop lourd, voici une alternative avec Transformers.js :

### Installation
\`\`\`bash
npm install @xenova/transformers
\`\`\`

### Code alternatif pour le contrôleur
\`\`\`javascript
const { pipeline } = require('@xenova/transformers');

// Initialiser le modèle de résumé
let summarizer = null;

const initializeSummarizer = async () => {
if (!summarizer) {
summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
}
return summarizer;
};

// Dans la fonction analyzeDocument
const summarizer = await initializeSummarizer();
const summary = await summarizer(text.substring(0, 1000), {
max_length: 100,
min_length: 30,
});
\`\`\`

## Modèles recommandés par taille

### Ultra-léger (< 1GB)
- `llama3.2:1b` - 1.3GB
- `phi3:mini` - 2.3GB
- `gemma2:2b` - 1.6GB

### Léger (1-4GB)
- `llama3.2:3b` - 2.0GB
- `phi3:medium` - 7.9GB

### Performance vs Taille
- **llama3.2:1b**: Très rapide, qualité correcte pour résumés simples
- **phi3:mini**: Bon équilibre performance/taille
- **gemma2:2b**: Excellente qualité, taille raisonnable

## Configuration recommandée

Pour un usage en production, utilisez ces paramètres dans le contrôleur :

\`\`\`javascript
{
model: "llama3.2:1b",
options: {
temperature: 0.3,    // Moins de créativité, plus de précision
top_p: 0.9,         // Diversité contrôlée
max_tokens: 300,    // Limite de tokens pour éviter les réponses trop longues
repeat_penalty: 1.1 // Éviter les répétitions
}
}
\`\`\`

## Dépannage

### Ollama ne démarre pas
\`\`\`bash
# Vérifier le statut
ollama list

# Redémarrer le service
pkill ollama
ollama serve
\`\`\`

### Modèle trop lent
- Utilisez `llama3.2:1b` au lieu de modèles plus gros
- Réduisez `max_tokens`
- Augmentez `temperature` légèrement

### Erreur de mémoire
- Fermez les autres applications
- Utilisez un modèle plus petit
- Ajustez les paramètres Docker si nécessaire
