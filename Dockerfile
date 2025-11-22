FROM node:18-alpine
WORKDIR /usr/src/app

# Install deps
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy sources
COPY . .

RUN npm run build

EXPOSE 4000
CMD ["node", "dist/index.js"]
