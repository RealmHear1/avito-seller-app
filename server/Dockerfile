FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
