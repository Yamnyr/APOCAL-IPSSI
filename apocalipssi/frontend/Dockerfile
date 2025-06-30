# Étape 1 : Build de l'app
FROM node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Étape 2 : Serveur nginx pour servir le frontend
FROM nginx:alpine

# Copier le build dans nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration nginx si besoin (optionnel)
# COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
