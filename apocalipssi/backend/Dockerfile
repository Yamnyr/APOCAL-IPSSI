# Base image
FROM node:18

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Installer Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Exposer le port utilisé par le backend
EXPOSE 5000

# Commande pour démarrer l'application avec Ollama
CMD ["sh", "-c", "ollama serve & sleep 10 && ollama pull llama3.2:1b && npm run dev"]
