FROM node:18.16.1-alpine as builder
WORKDIR /usr/src/app
COPY ./docker/prod/Dockerfile/files/package.json ./
RUN npm i

FROM node:18.16.1-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ /usr/src/app/
STOPSIGNAL SIGINT