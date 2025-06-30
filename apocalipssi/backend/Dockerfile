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

# Exposer le port utilisé par le backend
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]
