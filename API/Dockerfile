# Usa una imagen de Node.js
FROM node:20-alpine

# Crea un directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package.json /app

# Instala las dependencias
RUN npm install

# Copia el resto del código de la API
COPY . .

RUN npm run build

# Expone el puerto de la API
EXPOSE 3000

# Comando para iniciar la API
CMD ["node", "dist/main.js"]
