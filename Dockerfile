# Common build stage
FROM node:18.17.0-alpine as installer
ARG NPM_TOKEN
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm install
RUN rm .npmrc

FROM installer as builder
WORKDIR /app
COPY .swcrc knexfile.ts ./
COPY ./src  ./src
RUN npm run build
RUN npm prune --production

FROM gcr.io/distroless/nodejs18-debian11 as prod-server
WORKDIR /app
COPY --from=builder app/package.json .
COPY --from=builder app/package-lock.json .
COPY --from=builder app/dist ./dist
COPY --from=builder app/node_modules ./node_modules

CMD ["dist/index.js"]