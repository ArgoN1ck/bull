#!/bin/bash
set -e
source ./set-env.sh
export COMPOSE_INTERACTIVE_NO_CLI=1 && docker-compose -f ./docker/dev/docker-compose.yml down
docker volume rm bull-postgres-volume --force
docker volume rm bull-redis-volume --force
