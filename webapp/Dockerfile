# Usa una imagen de Node.js
FROM node:20-alpine as build-step

RUN mkdir -p /webapp

# Crea un directorio de trabajo
WORKDIR /webapp

# Copia los archivos package.json y package-lock.json
COPY package.json /webapp

# Instala las dependencias
RUN npm install

# Copia el resto del código de la webapp
COPY . /webapp

RUN npm run build --prod

# Usa un servidor de producción como nginx o http-server para servir la app
FROM nginx:1.27.2-alpine

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos de la aplicación Angular
COPY --from=build-step /webapp/dist/e/browser /usr/share/nginx/html

# Expone el puerto 80 para Nginx
EXPOSE 80
