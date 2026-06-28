# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile

FROM deps AS build
RUN pnpm --filter @waypoint/shared build \
 && pnpm --filter @waypoint/domain build \
 && pnpm --filter @waypoint/logging build \
 && pnpm --filter @waypoint/config build \
 && pnpm --filter @waypoint/database build \
 && pnpm --filter @waypoint/api build \
 && pnpm --filter @waypoint/worker build

FROM base AS api
ENV NODE_ENV=production
COPY --from=build /app /app
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["node", "dist/index.js"]

FROM base AS worker
ENV NODE_ENV=production
COPY --from=build /app /app
WORKDIR /app/apps/worker
CMD ["node", "dist/index.js"]
