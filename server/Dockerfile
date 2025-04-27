FROM oven/bun:1.1.13 as builder

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

CMD ["bun", "run", "start"]
