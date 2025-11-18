FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p data
RUN npm run build
RUN npm run seed
EXPOSE 3000
CMD ["npm", "start"]