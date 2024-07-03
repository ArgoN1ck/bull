#!/bin/bash
set -e
source ./set-env.sh

if [ -z "${NO_PUSH_DOCKER_IMAGES}" ]; then
    if [ -z "${CI_COMMIT_SHORT_SHA}" ]; then
        echo "No deploy to github [INFO-4]"
    else
        echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER $CI_REGISTRY --password-stdin
    fi
fi

docker volume create --name=bull-postgres-volume --label=bull-postgres-volume
docker volume create --name=bull-redis-volume --label=bull-redis-volume

export COMPOSE_INTERACTIVE_NO_CLI=1 && docker-compose -f ./docker/prod/docker-compose.yml --compatibility up -d bull-postgres

until docker exec --tty $(docker ps -aqf "name=bull-postgres") pg_isready -U postgres; do
    echo "Waiting for postgres..."
    sleep 2
done

export PSQL_PORT=5432
export PSQL_HOST=localhost
export PSQL_URL=postgres://${PSQL_USERNAME}:${PSQL_PASSWORD}@${PSQL_HOST}:${PSQL_PORT}/${PSQL_DATABASE}?schema=public

cd ..
npm run migration:run
cd devops

export PSQL_PORT=5432
export PSQL_HOST=bull-postgres
export PSQL_URL=postgres://${PSQL_USERNAME}:${PSQL_PASSWORD}@${PSQL_HOST}:${PSQL_PORT}/${PSQL_DATABASE}?schema=public

export COMPOSE_INTERACTIVE_NO_CLI=1 && docker-compose -f ./docker/prod/docker-compose.yml --compatibility up -d
