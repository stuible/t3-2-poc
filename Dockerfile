##### DEPENDENCIES

FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY prisma ./prisma

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

##### BUILDER

FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat openssl1.1-compat

# ARG DATABASE_URL ${DATABASE_URL}
# ARG WAIT_TIMES_API_TOKEN ${WAIT_TIMES_API_TOKEN}
# ARG REDIS_URL ${REDIS_URL}
# ARG NEXT_PUBLIC_WS_URL ${NEXT_PUBLIC_WS_URL}

ARG DATABASE_URL
ARG WAIT_TIMES_API_TOKEN
ARG REDIS_URL
ARG NEXT_PUBLIC_WS_URL

ENV DATABASE_URL ${DATABASE_URL}
ENV WAIT_TIMES_API_TOKEN ${WAIT_TIMES_API_TOKEN}
ENV REDIS_URL  ${REDIS_URL}
ENV NEXT_PUBLIC_WS_URL ${NEXT_PUBLIC_WS_URL}


WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
    if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
    elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=0 npm run build; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

##### RUNNER

FROM node:18-alpine AS runner
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# ARG DATABASE_URL ${DATABASE_URL}
# ARG WAIT_TIMES_API_TOKEN ${WAIT_TIMES_API_TOKEN}
# ARG REDIS_URL ${REDIS_URL}
# ARG NEXT_PUBLIC_WS_URL ${NEXT_PUBLIC_WS_URL}

ARG DATABASE_URL
ARG WAIT_TIMES_API_TOKEN
ARG REDIS_URL
ARG NEXT_PUBLIC_WS_URL

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

COPY --from=builder --chown=nextjs:nodejs /app/.next/ ./.next
COPY --from=builder --chown=nextjs:nodejs /app/dist/ ./dist

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "dist/server.js"]