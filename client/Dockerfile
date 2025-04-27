FROM oven/bun:1.1.13 AS builder

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM alpine:3.20

RUN apk add --no-cache lighttpd

WORKDIR /static
COPY --from=builder /app/dist .

# Настроить lighttpd
RUN echo "server.document-root = \"/static\"" > /etc/lighttpd/lighttpd.conf

CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
