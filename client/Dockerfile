FROM oven/bun:1.1.13 as builder

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
RUN apt update && apt install -y git

COPY . .
RUN bun run build

FROM alpine:3.20

WORKDIR /static

COPY --from=builder /app/.output/public .

CMD ["sleep", "infinity"]
