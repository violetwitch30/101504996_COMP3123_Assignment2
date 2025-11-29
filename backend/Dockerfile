FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
RUN mkdir -p src/uploads
CMD ["node", "src/server.js"]