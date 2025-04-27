# Builder bun
FROM oven/bun:1.1.13 AS builder

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .

ARG COMMIT_HASH=unknown
ENV COMMIT_HASH=${COMMIT_HASH}

RUN export COMMIT_HASH=$COMMIT_HASH && bun run build

# Production
FROM node:20-alpine3.18

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist .

ENV PORT=3000

CMD ["sh", "-c", "serve . -l $PORT -s"]
