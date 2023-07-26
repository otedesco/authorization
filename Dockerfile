FROM node:18.16.1-alpine3.17 AS build-enviroment
RUN apk add --no-cache libc6-compat
RUN apk update
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm
RUN pnpm i -g turbo

FROM build-enviroment AS turbo-output
WORKDIR /app
COPY . .
RUN turbo prune --scope=auth --docker

FROM build-enviroment as builder
WORKDIR /app
COPY --from=turbo-output /app/out/json/ .
COPY --from=turbo-output /app/out/full/ .
COPY --from=turbo-output /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY turbo.json turbo.json
RUN pnpm install --ignore-scripts
RUN pnpm run build --filter auth
RUN pnpm run clean

FROM build-enviroment as prod-installer
WORKDIR /app
COPY --from=builder /app .
RUN pnpm install --filter auth --ignore-scripts --prod

FROM build-enviroment as migration
WORKDIR /app
COPY --from=builder /app .
CMD pnpm run migrate

FROM node:18.16.1-alpine3.17 as prod-server
WORKDIR /app
COPY --from=prod-installer /app .
CMD node services/auth/dist/index.js
