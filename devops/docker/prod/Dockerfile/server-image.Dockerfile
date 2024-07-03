FROM "bull-server-base"
WORKDIR /usr/src/app
COPY ./docker/prod/Dockerfile/files/dist .
EXPOSE 3333
STOPSIGNAL SIGINT
ENTRYPOINT ["sh" , "-c", "node apps/api/main.js"]