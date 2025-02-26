# Pobieramy Node.js jako bazę
FROM node:18-alpine AS builder

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy pliki do kontenera
COPY package.json package-lock.json ./
RUN npm install

# Kopiujemy pozostałe pliki
COPY . .

# Budujemy aplikację Next.js
RUN npm run build

# Drugi etap - uruchomienie aplikacji w trybie produkcyjnym
FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production
CMD ["npm", "run", "start"]
