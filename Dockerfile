# ---------- Stage 1: builder ----------
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.22.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

COPY . .

ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

RUN pnpm prisma generate
RUN pnpm build

# ---------- Stage 2: development ----------
FROM builder AS development

ENV NODE_ENV=dev

EXPOSE 3001

CMD ["pnpm", "start:dev"]

# ---------- Stage 3: production ----------
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@11.22.0 --activate

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["./entrypoint.sh"]
