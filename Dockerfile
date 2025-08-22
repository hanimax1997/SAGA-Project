# Cette partie permet de créer un container avec une image node
# 18.19 represente la version
# l'idée est de pouvoir deployer le projet avec
FROM node:18.19-alpine AS build
# Créer un repertoire virtuel 
WORKDIR /app
# Copier dans les dossiers package.json package-lock.json ./
# lancer le build 
RUN npm cache clean --force
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build --prod


### STAGE 2:RUN ###
FROM nginx:stable-alpine AS ngi

# deployer le code pour le reutiliser 
COPY --from=build /app/dist /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
# Copy Nginx configuration and ssl certificate
COPY ./nginx-config/conf.d  /etc/nginx/conf.d
COPY ./nginx-config/saga  /etc/ssl/saga