FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY tsconfig.json ./tsconfig.json
COPY src ./src

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:docker"]
