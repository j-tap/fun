FROM oven/bun:1.1.13 AS builder

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM alpine:3.20

WORKDIR /static

ARG COMMIT_HASH=unknown
ENV COMMIT_HASH=${COMMIT_HASH}

COPY --from=builder /app/dist .

CMD ["sleep", "infinity"]
