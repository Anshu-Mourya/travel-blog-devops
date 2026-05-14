# Base Image

FROM node:20

# App Directory

WORKDIR /app

# Copy package files

COPY package*.json ./

# Install dependencies

RUN npm install

# Copy all files

COPY . .

# Expose backend port

EXPOSE 5001

# Start server

CMD ["node", "server.js"]