FROM node:18.17.0-alpine as installer
ARG NPM_TOKEN
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install
RUN rm .npmrc

FROM installer as builder
WORKDIR /app
COPY .swcrc knexfile.ts ./
COPY ./src  ./src
RUN pnpm run build
RUN pnpm prune --prod

FROM gcr.io/distroless/nodejs18-debian11 as prod-server
WORKDIR /app
COPY --from=builder app/package.json .
COPY --from=builder app/pnpm-lock.yaml .
COPY --from=builder app/dist ./dist
COPY --from=builder app/node_modules ./node_modules

CMD ["dist/index.js"]