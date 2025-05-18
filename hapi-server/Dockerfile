# Use Node.js LTS image
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .

CMD ["sh", "-c", "NODE_ENV=development npx knex migrate:latest --knexfile ./knexfile.cjs && NODE_ENV=development node server.cjs"]
