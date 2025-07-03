#!/bin/bash

echo "🚀 Configuration d'Ollama pour APOCALIPSSI"

# Attendre qu'Ollama soit prêt
echo "⏳ Attente du démarrage d'Ollama..."
sleep 10

# Vérifier si Ollama répond
while ! curl -s http://localhost:11434/api/tags > /dev/null; do
    echo "⏳ Ollama n'est pas encore prêt, attente..."
    sleep 5
done

echo "✅ Ollama est prêt !"

# Télécharger le modèle léger
echo "📥 Téléchargement du modèle llama3.2:1b..."
curl -X POST http://localhost:11434/api/pull \
     -H "Content-Type: application/json" \
     -d '{"name": "llama3.2:1b"}'

echo "✅ Configuration terminée !"
