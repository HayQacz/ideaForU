FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production
CMD ["npm", "run", "start"]
