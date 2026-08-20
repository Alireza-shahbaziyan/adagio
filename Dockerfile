FROM oven/bun:1-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./

RUN bun config set registry https://mirror.abrha.net/repository/npm/

RUN bun install --frozen-lockfile



FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG NEXT_PUBLIC_BACKEND_BASE_URL
ARG NEXT_PUBLIC_FRONTEND_BASE_URL

ENV NEXT_PUBLIC_BACKEND_BASE_URL=$NEXT_PUBLIC_BACKEND_BASE_URL
ENV NEXT_PUBLIC_FRONTEND_BASE_URL=$NEXT_PUBLIC_FRONTEND_BASE_URL

RUN echo "BACKEND: $NEXT_PUBLIC_BACKEND_BASE_URL"
RUN echo "FRONTEND: $NEXT_PUBLIC_FRONTEND_BASE_URL"

RUN bun run build



FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system nodejs \
    && adduser --system nextjs --ingroup nodejs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["bun", "server.js"]