FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL=file:/app/data/course.db \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nodejs \
    && adduser -S nextjs -G nodejs \
    && mkdir -p /app/data /app/uploads /app/logs \
    && chown -R nextjs:nodejs /app

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle

# Remove non-runtime assets that can be pulled in by conservative file tracing.
RUN rm -rf \
      /app/archive \
      /app/docs \
      /app/res \
      /app/scripts \
      /app/tests \
      /app/vendor \
      /app/playwright-report \
      /app/test-results \
      /app/.claude \
      /app/.github \
    && rm -rf /app/data/* /app/logs/* /app/uploads/* \
    && rm -rf /app/.next/cache /app/.next/types /app/.next/diagnostics \
    && rm -f \
      /app/README.md \
      /app/DEPLOY.md \
      /app/Dockerfile \
      /app/docker-compose.yml \
      /app/findings.md \
      /app/progress.md \
      /app/task_plan.md \
      /app/TEST_ACCOUNTS.local.md \
      /app/theme-showcase.html \
      /app/需求与现有资源清单.md \
      /app/package-lock.json \
      /app/playwright.config.ts \
      /app/eslint.config.mjs \
      /app/drizzle.config.ts \
      /app/postcss.config.mjs \
      /app/tailwind.config.js \
      /app/tsconfig.json

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
